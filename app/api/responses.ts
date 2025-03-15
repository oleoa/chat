/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";

export default class Res
{
  // When it success, return an object to the client
  success(data: any) { return NextResponse.json({ status: "Success", data: data }, { status: 200 }) }
  created(data: any) { return NextResponse.json({ status: "Success", data: data }, { status: 201 }) }

  // When it fails, return a message to the client
  server_error(message: string) { return NextResponse.json({ status: "Server Error", message: message }, { status: 500 }) }
  bad_request(message: string) { return NextResponse.json({ status: "Bad Request", message: message }, { status: 400 }) }
}
