import twilio from "twilio";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import data from "@/public/details.json";
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;   
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; 

const client = twilio(accountSid, authToken);

async function sendSMS(to: string, message: string) {
    try {
        const response = await client.messages.create({
            body: message,
            from: twilioPhoneNumber,
            to: to,
        });

        console.log("Message sent successfully:", response.sid);
    } catch (error) {
        console.error("Error sending SMS:", error);
    }
}

export async function POST(req: Request) {
    try{
    const body = await req.json();
    const { vehiclenumber } = body;
    const datas  = data.find(details => vehiclenumber == details.vehicleNumber);
    if (!datas) {
        return NextResponse.json({ error: "Vehicle number not found" }, { status: 404 });
    }
    const phonenumber = datas.phoneNumber;
    const name = datas.name;
    const message = `Good morning, ${name}. Our system detected a routine match with someone nearby. If interested in carpooling, their contact will be provided. Carpooling helps the environment and fosters connections.
Drive safe,  
MVD`;

    sendSMS(phonenumber,message);
    return NextResponse.json({ message: "Message sent successfully" }, { status: 200 });
    }catch(error){
        console.log(error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}