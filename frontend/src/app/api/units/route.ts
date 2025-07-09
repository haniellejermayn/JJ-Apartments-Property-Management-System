// app/api/monthlyreports/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Backend data:', data);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching monthly reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from backend' },
      { status: 500 }
    );
  }
}

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     console.log('Creating unit with data:', body);
    
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/units`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(body),
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('Backend error:', errorText);
//       throw new Error(errorText || `Backend responded with status: ${response.status}`);
//     }

//     const responseText = await response.text();
//     console.log('Backend success response:', responseText);
    
//     return NextResponse.json({ message: responseText }, { status: 201 });
//   } catch (error) {
//     console.error('Error creating unit:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to create unit' },
//       { status: 500 }
//     );
//   }
// }