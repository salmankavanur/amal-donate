import { NextRequest,NextResponse } from "next/server";
import Razorpay from "razorpay"

const razorpay =new Razorpay({
    key_id : process.env.RAZORPAY_KEY_ID!,

})