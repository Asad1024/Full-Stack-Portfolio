import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const supabase = createSupabaseServerClient()
    
    // Save to database
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert([
        {
          name,
          email,
          subject,
          message,
          read: false,
        },
      ])

    if (dbError) {
      console.error('Database error:', dbError)
      // Continue even if DB fails, try to send email
    }

    // Get recipient email from profile
    let recipientEmail = process.env.CONTACT_EMAIL || 'your-email@gmail.com'
    
    try {
      const { data: profile } = await supabase
        .from('profile')
        .select('email')
        .single()
      
      if (profile?.email) {
        recipientEmail = profile.email
      }
    } catch (error) {
      console.error('Error fetching profile email:', error)
    }

    // Send email using Resend
    if (process.env.RESEND_API_KEY) {
      try {
        const { data, error: emailError } = await resend.emails.send({
          from: 'Portfolio Contact <onboarding@resend.dev>', // Update this with your verified domain
          to: recipientEmail,
          replyTo: email,
          subject: `Portfolio Contact: ${subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>
              <div style="margin-top: 20px;">
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Subject:</strong> ${subject}</p>
                <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-left: 3px solid #000;">
                  <strong>Message:</strong>
                  <p style="margin-top: 10px; white-space: pre-wrap;">${message}</p>
                </div>
              </div>
              <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
                <p>This email was sent from your portfolio contact form.</p>
                <p>Reply directly to this email to respond to ${name}.</p>
              </div>
            </div>
          `,
          text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}

---
This email was sent from your portfolio contact form.
Reply directly to this email to respond to ${name}.
          `,
        })

        if (emailError) {
          console.error('Resend email error:', emailError)
          // Don't fail the request if email fails, but log it
        } else {
          console.log('Email sent successfully:', data?.id)
        }
      } catch (emailError) {
        console.error('Error sending email:', emailError)
        // Continue even if email fails
      }
    } else {
      console.warn('RESEND_API_KEY not configured. Email not sent.')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error submitting contact form:', error)
    return NextResponse.json(
      { error: 'Failed to submit message' },
      { status: 500 }
    )
  }
}
