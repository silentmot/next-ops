import { NextResponse } from "next/server";

/**
 * Health check endpoint for monitoring service availability
 * Purpose: Simple health check for load balancer health checks and uptime monitoring
 * Request: No parameters
 * Response: Plain text 'Hello, from API!'
 * Status: 200
 * Use cases:
 * - Load balancer health checks
 * - Uptime monitoring services
 * - Basic API connectivity tests
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json("Hello, from API!");
}
