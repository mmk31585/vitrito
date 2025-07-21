import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "resend";

const resend = new Resend("re_XJyCPqe6_2UTRQ3bWqSrhJx1tWMkZvhBJ");

serve(async (req) => {
    const { name, email, message, profileEmail } = await req.json();

    try {
        const data = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: profileEmail,
            subject: `New message from ${name} on Vitrito`,
            html: `<p>You have a new message from ${name} (${email}):</p><p>${message}</p>`,
        });

        return new Response(JSON.stringify(data), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
});
