// import { Request, Response } from "express";
// import jwt from 'jsonwebtoken';
import bcrypt from "bcrypt";
// import User from "../model/usermodel";
// import { config } from "dotenv";
import prisma from "../../lib/prisma";

import { NextResponse } from "next/server";

// const prisma = new PrismaClient();

// Load environment variables
// config();

export async function POST(request) {
  

  // console.log(req.body);

  const body = await request.json();
  const { email, password, phonenumber } = body;
  if (!email || !password) {
    return new NextResponse("Missing Fields", { status: 400 });
  }

  let oneUser;
  try {
    // const token = jwt.sign({
    //   email: email,
    // }, process.env.SECRET_KEY!);
    let user;
    try {
      user = await prisma.user.findUnique({ where: { email: email } });
      
    } catch (error) {
      console.error("error to find user", error);
    }

    if (!user) {
      
      // No user, registration will be done
      //   const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const hashedPassword = await bcrypt.hash(password, 10);
      // console.log(hashedPassword);

      const name = email.split("@")[0];
      

      //   await prisma.user.create({
      //     data:{
      //         email: req.body.email,
      //         password: hashedPassword,
      //         name:name
      //     }

      //   });

      oneUser = await prisma.user.create({
        data: {
          email: email,
          name: name,
          password: hashedPassword,
          phonenumber: phonenumber,
        },
      });
      

      let workspace, workspaceMember;
      try {
        workspace = await prisma.workspace.create({
          data: {
            name: name,
            workspace_creator_id: oneUser.id,
          },
        });

        // Create WorkspaceMember and connect to the created Workspace
        workspaceMember = await prisma.workspaceMember.create({
          data: {
            user_id: oneUser.id,
            workspace_id: workspace.workspace_id,
          },
        });
        
      } catch (error) {
        console.error("Error creating workspace:", error);
        return (
          NextResponse
            //   .status(500)
            .json({ status: "error", error: "Workspace creation failed" })
        );
      }

      

      return NextResponse.json({
        message: "Registration Successful",
        User: oneUser,
        workspace: workspace,
        workspaceMember: workspaceMember,
        success: true,
      });
    } else {
      

      if (user.password !== null) {
        

        const isPasswordValid = await bcrypt.compare(password, user.password);
        // User exists, login will be done
        

        if (isPasswordValid) {
          

          return NextResponse.json({
            message: "Login Successful",
            // token: token,
            success: true,
          });
        } else {
          

          return NextResponse.json({
            message: "Incorrect password",
            ok: false,
            status: 401, // Unauthorized
          });
        }
      }
    }
  } catch (error) {
    return NextResponse.json({
      status: "error",
      error: "Authentication error occurredence",
      user: oneUser,
    });
  }
}
