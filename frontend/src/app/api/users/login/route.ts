import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Login request body:", body);

    const response = await fetch('http://localhost:8080/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body),
    });

    console.log("Backend response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Login error:", errorText);
      return NextResponse.json({ error: errorText || "Login failed" }, { status: response.status });
    }

    try {
      const user = await response.json();
      console.log("Login successful, user:", user);
      return NextResponse.json(user, { status: 200 });
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      return NextResponse.json({ error: "Invalid response from server" }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in login API route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
