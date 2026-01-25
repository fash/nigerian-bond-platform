import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

interface RequestBody {
  bvn: string;
}

interface SmileIDResponse {
  ResultCode: string | number;
  ResultText: string;
  Actions?: any;
  FullData?: {
    FirstName?: string;
    firstname?: string;
    LastName?: string;
    surname?: string;
    DateOfBirth?: string;
    dob?: string;
    PhoneNumber?: string;
    phone?: string;
    Photo?: string;
    [key: string]: any;
  };
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json();
    const { bvn } = body;

    if (!bvn || bvn.length !== 11) {
      return NextResponse.json(
        { success: false, message: "Invalid BVN format" },
        { status: 400 }
      );
    }

    const partner_id = process.env.SMILE_PARTNER_ID;
    const api_key = process.env.SMILE_API_KEY;
    const env_code = process.env.SMILE_ENV;

    if (!partner_id || !api_key) {
      console.error("Missing Environment Variables for Smile ID");
      return NextResponse.json(
        { success: false, message: "Server configuration error" },
        { status: 500 }
      );
    }

    
    const timestamp = new Date().toISOString();

    // 2. Generate Signature (HMAC SHA256)
    const hmac = crypto.createHmac('sha256', api_key);
    hmac.update(timestamp);
    const signature = hmac.digest('base64');

    // 3. Determine URL
    const baseUrl = env_code === '0' 
      ? 'https://testapi.smileidentity.com/v1' 
      : 'https://api.smileidentity.com/v1';

    // 4. Payload for Enhanced KYC (Job Type 5)
    const payload = {
      source_sdk: "rest_api",
      source_sdk_version: "1.0.0",
      partner_id: partner_id,
      timestamp: timestamp,
      signature: signature,
      country: "NG",
      id_type: "BVN",
      id_number: bvn,
      partner_params: {
        job_id: `job_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        user_id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
        job_type: 5 
      }
    };

    
    const smileRes = await fetch(`${baseUrl}/id_verification`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data: SmileIDResponse = await smileRes.json();
    console.log("Smile ID Response:", JSON.stringify(data, null, 2));

    
    if (String(data.ResultCode) === "1012") {
      const info = data.FullData || {};

      return NextResponse.json({
        success: true,
        message: "Verification Successful",
        data: {
          firstName: info.FirstName || info.firstname || "Verified User",
          lastName: info.LastName || info.surname || "",
          dateOfBirth: info.DateOfBirth || info.dob || "",
          phone: info.PhoneNumber || info.phone || "",
          
          photo: info.Photo || "" 
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: data.ResultText || "Verification failed. BVN not found or details mismatch.",
        code: data.ResultCode
      });
    }

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}