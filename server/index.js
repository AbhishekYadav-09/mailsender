import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://abhishekportfolio-eta.vercel.app/"
  ],
  methods: ["GET", "POST"],
}));

const resend = new Resend(process.env.RESEND_API_KEY);

app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const data = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>", 
      to: process.env.EMAIL_RECEIVER,
      subject: `New message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    console.log("Email sent:", data);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Resend error:", error);
    res
      .status(500)
      .json({ success: false, error: "Error sending email" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
