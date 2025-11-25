import { NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export async function GET(request, { params }) {
    try {
        const { dealId, attachmentId } = params;

        if (!dealId || !attachmentId) {
            return NextResponse.json(
                { error: 'Deal ID and Attachment ID are required' },
                { status: 400 }
            );
        }

        // Get authorization and tenant headers from the request
        const authHeader = request.headers.get('authorization');
        const tenantId = request.headers.get('x-tenant-id');

        // Build the backend URL
        const backendUrl = `${API_BASE_URL}/api/deals/${dealId}/attachments/${attachmentId}/download`;

        // Forward the request to the backend
        const backendResponse = await fetch(backendUrl, {
            method: 'GET',
            headers: {
                ...(authHeader && { 'Authorization': authHeader }),
                ...(tenantId && { 'X-Tenant-Id': tenantId }),
                // Forward cookies for authentication
                'Cookie': request.headers.get('cookie') || '',
            },
            credentials: 'include',
        });

        // If the backend request failed, return the error
        if (!backendResponse.ok) {
            const errorText = await backendResponse.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { error: errorText || 'Failed to download attachment' };
            }

            return NextResponse.json(
                errorData,
                { status: backendResponse.status }
            );
        }

        // Get the PDF file as a blob
        const pdfBlob = await backendResponse.blob();

        // Get content type from backend response or default to application/pdf
        const contentType = backendResponse.headers.get('content-type') || 'application/pdf';

        // Get filename from Content-Disposition header if available
        const contentDisposition = backendResponse.headers.get('content-disposition');
        let filename = 'attachment.pdf';
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
            if (filenameMatch && filenameMatch[1]) {
                filename = filenameMatch[1].replace(/['"]/g, '');
            }
        }

        // Return the PDF file with proper headers
        return new NextResponse(pdfBlob, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Content-Length': pdfBlob.size.toString(),
                'Cache-Control': 'no-cache',
            },
        });
    } catch (error) {
        console.error('Error downloading attachment:', error);
        return NextResponse.json(
            { error: 'Internal server error', message: error.message },
            { status: 500 }
        );
    }
}

