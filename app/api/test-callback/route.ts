import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();
  console.log('🎯 Test Callback received:', JSON.stringify(data, null, 2));
  
  // Simulate successful callback
  return NextResponse.json({ 
    ResultCode: 0, 
    ResultDesc: 'Success' 
  });
}