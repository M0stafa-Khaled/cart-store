import { Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";
import { Transporter } from "nodemailer";
import { IShippingAddress } from "../modules/orders/interfaces/shipping-address.interface";
import { formatEGPPrice } from "../common/utils/formatCurrency";

export interface IOrderNotification {
  id: string;
  orderNumber: string;
  subTotal: number;
  shippingCost: number;
  discount: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  status: string;
  shippingAddress: IShippingAddress;
  orderItems: Array<{
    product: {
      name: string;
      image: string;
    };
    price: number;
    quantity: number;
  }>;
  createdAt: string | Date;
  updatedAt: string | Date;
}

@Injectable()
export class EmailService {
  private transporter: Transporter;
  private readonly logger = new Logger(EmailService.name);
  private readonly fromEmail: string;
  private readonly frontendUrl: string;

  constructor() {
    this.fromEmail = process.env.EMAIL_FROM || "";
    this.frontendUrl = process.env.FRONTEND_URL || "";

    // Configure nodemailer transporter
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    // Verify SMTP connection
    this.verifyConnection();
  }

  private async verifyConnection(): Promise<void> {
    try {
      await this.transporter.verify();
      this.logger.log("SMTP connection verified successfully");
    } catch (error) {
      this.logger.error("SMTP connection failed:", error);
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${this.frontendUrl}/auth/verify-email?token=${token}&email=${email}`;

    const htmlContent = this.getVerificationEmailTemplate(verificationUrl);

    try {
      await this.transporter.sendMail({
        from: this.fromEmail,
        to: email,
        subject: "Verify Your Email Address",
        html: htmlContent,
      });

      this.logger.log(`Verification email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send verification email to ${email}:`,
        error,
      );
      throw new Error("Failed to send verification email");
    }
  }

  async sendResetPasswordEmail(email: string, otp: string): Promise<void> {
    const htmlContent = this.getResetPasswordTemplate(otp);

    try {
      await this.transporter.sendMail({
        from: this.fromEmail,
        to: email,
        subject: "Reset your password",
        html: htmlContent,
      });

      this.logger.log(`Reset password email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send reset password email to ${email}:`,
        error,
      );
      throw new Error("Failed to send reset password email");
    }
  }

  async sendNewOrderEmail(
    email: string,
    order: IOrderNotification,
  ): Promise<void> {
    const htmlContent = this.getNewOrderNotificationTemplate(order);

    try {
      await this.transporter.sendMail({
        from: this.fromEmail,
        to: email,
        subject: "New Order Notification",
        html: htmlContent,
      });

      this.logger.log(`New order email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send new order email to ${email}:`, error);
      throw new Error("Failed to send new order email");
    }
  }

  async sendOrderUpdateEmail(
    email: string,
    order: IOrderNotification,
    changes: {
      status?: string;
      paymentStatus?: string;
      isPaid?: boolean;
      isDelivered?: boolean;
      deliveredAt?: string | null;
    },
  ): Promise<void> {
    const htmlContent = this.getOrderUpdateNotificationTemplate(order, changes);

    try {
      await this.transporter.sendMail({
        from: this.fromEmail,
        to: email,
        subject: "Order Update Notification",
        html: htmlContent,
      });

      this.logger.log(`Order update email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send order update email to ${email}:`,
        error,
      );
      throw new Error("Failed to send order update email");
    }
  }

  // ** Templates ** -

  private getVerificationEmailTemplate(verificationUrl: string): string {
    return `<!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
        .button {
          display: inline-block;
          padding: 12px 24px;
          background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%);
          color: #ffffff;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 16px 0;
          text-align: center;
        }
        .link {
          word-break: break-all;
          color: #2563eb;
        }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: 'Inter', sans-serif; padding: 24px;">
      <div style="max-width: 640px; margin: 40px auto; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);">
        
        <!-- Header -->
        <div style="background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%); padding: 24px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
            Verify Your Email
          </h1>
          <p style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;">
            Complete your registration
          </p>
        </div>

        <!-- Content -->
        <div style="padding: 32px;">
          <p style="color: #1f2a44; font-size: 16px; line-height: 24px; margin: 0 0 16px;">
            Hello,
          </p>
          <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 24px;">
            Thank you for joining the Cart Store! To complete your registration, please verify your email address using the code below.
          </p>

          <!-- Verification Code Card -->
          <div style="background: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb; margin-bottom: 24px; text-align: center;">
            <h2 style="color: #1f2a44; font-size: 20px; font-weight: 600; margin: 0 0 16px;">
              Your Verification Code: ${" "}
            </h2>
            <div class="content">
              <p>Thank you for registering with us. To complete your registration, please verify your email address by clicking the button below:</p>
              
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600;">Verify Email Address</a>
              </div>
              
              <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
              <p class="link" style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
              
              <p><strong>Note:</strong> This verification link will expire in 24 hours.</p>
              
              <p>If you didn't create an account with us, please ignore this email.</p>
            </div>
            <p style="color: #4b5563; font-size: 14px; line-height: 22px; margin: 16px 0 0;">
              This url is valid for one hour from the time it was sent.
            </p>
          </div>

          <p style="color: #4b5563; font-size: 14px; line-height: 22px; margin: 0;">
            If you did not register on our platform, please ignore this email or contact our support team at 
            <a href="mailto:mostafa6320005@gmail.com" style="color: #2563eb; text-decoration: none;">mostafa6320005@gmail.com</a>.
          </p>
        </div>

        <!-- Footer -->
        <div style="background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">
            Cart Store • Empowering your shopping journey
          </p>
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            © ${new Date().getFullYear()} Cart Store. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>`;
  }

  private getResetPasswordTemplate(otp: string): string {
    return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap");
        </style>
      </head>
      <body
        style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: 'Inter', sans-serif;"
      >
        <div
          style="max-width: 640px; margin: 40px auto; background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);"
        >
    
          <!-- Header -->
          <div
            style="background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%); padding: 24px; text-align: center;"
          >
            <h1
              style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;"
            >
              Reset Your Password
            </h1>
            <p
              style="margin: 8px 0 0; color: rgba(255, 255, 255, 0.9); font-size: 16px;"
            >
              Secure your account
            </p>
          </div>
    
          <!-- Content -->
          <div style="padding: 32px;">
            <p
              style="color: #1f2a44; font-size: 16px; line-height: 24px; margin: 0 0 16px;"
            >
              Hello,
            </p>
            <p
              style="color: #4b5563; font-size: 16px; line-height: 24px; margin: 0 0 24px;"
            >
              We received a request to reset your password for your Cart Store
              account. Please use the code below to proceed with resetting your
              password.
            </p>
    
            <!-- Reset Code Card -->
            <div
              style="background: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #e5e7eb; margin-bottom: 24px; text-align: center;"
            >
              <h2
                style="color: #1f2a44; font-size: 20px; font-weight: 600; margin: 0 0 16px;"
              >
                Your Reset Code:${" "}
              </h2>
              <div
                style="background: #f3f4f6; border-radius: 8px; padding: 16px; display: inline-block;"
              >
                <span
                  style="color: #2563eb; font-size: 24px; font-weight: 700; letter-spacing: 4px;"
                >
                  ${otp}
                </span>
              </div>
              <p
                style="color: #4b5563; font-size: 14px; line-height: 22px; margin: 16px 0 0;"
              >
                This code is valid for one hour from the time it was sent.
              </p>
            </div>
    
            <p
              style="color: #4b5563; font-size: 14px; line-height: 22px; margin: 0;"
            >
              If you did not request a password reset, please ignore this email or
              contact our support team at
              <a
                href="mailto:mostafa6320005@gmail.com"
                style="color: #2563eb; text-decoration: none;"
              >mostafa6320005@gmail.com</a>.
            </p>
          </div>
    
          <!-- Footer -->
          <div
            style="background: #f8fafc; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;"
          >
            <p style="color: #6b7280; font-size: 14px; margin: 0 0 8px;">
              Cart Store • Securing your shopping journey
            </p>
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              © ${new Date().getFullYear()} Cart Store. All rights reserved.
            </p>
          </div>
        </div>
      </body>
    </html>`;
  }

  private getNewOrderNotificationTemplate(order: IOrderNotification) {
    const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background: #f9fafb; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
        .header { background: #1f2937; padding: 20px; text-align: center; color: white; }
        .content { padding: 28px; }
        .section { margin-bottom: 24px; }
        .label { font-weight: 600; color: #374151; font-size: 14px; display: block; margin-bottom: 6px; }
        .value { color: #1f2937; font-size: 15px; }
        .items-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .items-table th { text-align: left; padding: 12px 0; color: #6b7280; font-weight: 500; font-size: 13px; border-bottom: 1px solid #e5e7eb; }
        .items-table td { padding: 14px 0; border-bottom: 1px solid #f3f4f6; }
        .price { text-align: center; white-space: nowrap; }
        .total-row { font-weight: 600; font-size: 16px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1 style="margin:0; font-size:22px; font-weight:700;">New Order Created</h1>
          <p style="margin:6px 0 0; font-size:14px; opacity:0.9;">Order Number: ${order.orderNumber}</p>
        </div>

        <!-- Body -->
        <div class="content">

          <p style="margin:0 0 20px; color:#4b5563;">Hello,</p>
          <p style="margin:0 0 24px; color:#4b5563; line-height:1.6;">
            You have successfully created a new order on <strong>Cart Store</strong>. Below are the full details of your order.
          </p>

          <!-- Order Info -->
          <div class="section">
            <span class="label">Order Date</span>
            <div class="value">${orderDate}</div>
          </div>

          <div class="section">
            <span class="label">Order Status</span>
            <div class="value">
              <strong style="color:#059669; background:#ecfdf5; padding:2px 8px; border-radius:4px; font-size:13px;">
                ${order.status}
              </strong>
            </div>
          </div>

          <div class="section">
            <span class="label">Payment Method</span>
            <div class="value">${order.paymentMethod} (${order.paymentStatus})</div>
          </div>

          <!-- Order Items -->
          <div class="section">
            <span class="label">Order Items</span>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align:center;">Qty</th>
                  <th style="text-align:center;" class="price">Price</th>
                  <th style="text-align:center;" class="price">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.orderItems
                  .map(
                    (item) => `
                  <tr>
                    <td style="color:#1f2937; font-size:14px;">
                      ${item.product.name}
                      ${item.product.image ? `<br><img src="${item.product.image}" alt="${item.product.name}" style="width:40px; height:40px; object-fit:cover; border-radius:4px; margin-top:6px;">` : ""}
                    </td>
                    <td style="text-align:center; color:#4b5563;">${item.quantity}</td>
                    <td style="text-align:center;" class="price">${formatEGPPrice(item.price)}</td>
                    <td style="text-align:center;" class="price">${formatEGPPrice(item.price * item.quantity)}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          <!-- Price Summary -->
          <div class="section" style="background:#f8fafc; padding:16px; border-radius:8px;">
            <table style="width:100%; font-size:14px;">
              <tr>
                <td style="padding:4px 0; color:#4b5563;">Subtotal</td>
                <td style="text-align:right; color:#1f2937;">${formatEGPPrice(order.subTotal)}</td>
              </tr>
              <tr>
                <td style="padding:4px 0; color:#4b5563;">Shipping Cost</td>
                <td style="text-align:right; color:#1f2937;">${formatEGPPrice(order.shippingCost)}</td>
              </tr>
              ${
                order.discount > 0
                  ? `<tr>
                    <td style="padding:4px 0; color:#16a34a;">Discount</td>
                    <td style="text-align:right; color:#16a34a;">${formatEGPPrice(order.discount)}</td>
                  </tr>`
                  : ""
              }
              <tr class="total-row">
                <td style="padding:8px 0 0; border-top:1px dashed #d1d5db; margin-top:8px; color:#1f2937; font-weight:600;">
                  Total Amount
                </td>
                <td style="text-align:right; border-top:1px dashed #d1d5db; padding:8px 0 0; color:#1f2937; font-size:18px;">
                  ${formatEGPPrice(order.totalPrice)}
                </td>
              </tr>
            </table>
          </div>

          <!-- Shipping Address -->
          <div class="section">
            <span class="label">Shipping Address</span>
            <div class="value" style="background:#f9fafb; padding:12px; border-radius:6px; font-size:14px; line-height:1.5;">
              ${order.shippingAddress.city.name} - ${order.shippingAddress.city.country.name}<br>
              ${order.shippingAddress.address}<br>
              <small style="color:#6b7280;">Phone: ${order.shippingAddress.phone}</small>
            </div>
          </div>

          <hr style="border:0; border-top:1px solid #e5e7eb; margin:28px 0;">

          <p style="font-size:13px; color:#6b7280; margin:0; line-height:1.5;">
            This is an automated notification. You created this order on our platform.<br>
            If you have any questions, reply to this email or contact us at 
            <a href="mailto:mostafa6320005@gmail.com" style="color:#2563eb;">mostafa6320005@gmail.com</a>.
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="margin:0; color:#9ca3af;">
            © ${new Date().getFullYear()} Cart Store. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  }

  private getOrderUpdateNotificationTemplate(
    order: IOrderNotification,
    changes: {
      status?: string;
      paymentStatus?: string;
      isPaid?: boolean;
      isDelivered?: boolean;
      deliveredAt?: string | null;
    },
  ) {
    const updatedAt = new Date(order.updatedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Detect what changed
    const changeMessages: string[] = [];
    if (changes.status)
      changeMessages.push(
        `Order status updated to <strong>${changes.status}</strong>`,
      );
    if (changes.paymentStatus)
      changeMessages.push(
        `Payment status updated to <strong>${changes.paymentStatus}</strong>`,
      );
    if (changes.isPaid !== undefined)
      changeMessages.push(
        `Payment confirmed: <strong>${changes.isPaid ? "Paid" : "Unpaid"}</strong>`,
      );
    if (changes.isDelivered !== undefined)
      changeMessages.push(
        `Delivery status: <strong>${changes.isDelivered ? "Delivered" : "Not Delivered"}</strong>`,
      );
    if (changes.deliveredAt)
      changeMessages.push(
        `Delivered on <strong>${new Date(changes.deliveredAt).toLocaleDateString()}</strong>`,
      );

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        body { font-family: 'Inter', sans-serif; background: #f9fafb; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 12px rgba(0,0,0,0.05); }
        .header { background: #7c3aed; padding: 20px; text-align: center; color: white; }
        .content { padding: 28px; }
        .section { margin-bottom: 24px; }
        .label { font-weight: 600; color: #374151; font-size: 14px; display: block; margin-bottom: 6px; }
        .value { color: #1f2937; font-size: 15px; }
        .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 14px; border-radius: 0 6px 6px 0; margin: 20px 0; font-size: 14px; color: #92400e; }
        .items-table { width: 100%; border-collapse: collapse; margin: 16px 0; }
        .items-table th { text-align: left; padding: 12px 0; color: #6b7280; font-weight: 500; font-size: 13px; border-bottom: 1px solid #e5e7eb; }
        .items-table td { padding: 14px 0; border-bottom: 1px solid #f3f4f6; }
        .price { text-align: center; white-space: nowrap; }
        .total-row { font-weight: 600; font-size: 16px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
        .badge { display: inline-block; padding: 2px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
        .badge-success { background: #ecfdf5; color: #059669; }
        .badge-warning { background: #fffbeb; color: #d97706; }
        .badge-info { background: #dbeafe; color: #1d4ed8; }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        <div class="header">
          <h1 style="margin:0; font-size:22px; font-weight:700;">Order Updated</h1>
          <p style="margin:6px 0 0; font-size:14px; opacity:0.9;">Order Number: ${order.orderNumber}</p>
        </div>

        <!-- Body -->
        <div class="content">

          <p style="margin:0 0 16px; color:#4b5563;">Hello,</p>

          <!-- Update Alert -->
          <div class="alert">
            <strong>Your order has been updated!</strong><br>
            <span style="font-size:13px;">${changeMessages.join(" • ")}</span>
          </div>

          <p style="margin:0 0 24px; color:#4b5563; line-height:1.6;">
            Here are the latest details of your order.
          </p>

          <!-- Current Status -->
          <div class="section">
            <span class="label">Current Status</span>
            <div class="value">
              <span class="badge ${order.status === "DELIVERED" ? "badge-success" : order.status === "CANCELED" ? "badge-warning" : "badge-info"}">
                ${order.status}
              </span>
            </div>
          </div>

          <div class="section">
            <span class="label">Payment Status</span>
            <div class="value">
              <span class="badge ${order.paymentStatus === "PAID" ? "badge-success" : "badge-warning"}">
                ${order.paymentStatus}
              </span>
            </div>
          </div>

          <!-- Order Items -->
          <div class="section">
            <span class="label">Order Items</span>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align:center;">Qty</th>
                  <th style="text-align:center;" class="price">Price</th>
                  <th style="text-align:center;" class="price">Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.orderItems
                  .map(
                    (item) => `
                  <tr>
                    <td style="color:#1f2937; font-size:14px;">
                      ${item.product.name}
                      ${item.product.image ? `<br><img src="${item.product.image}" alt="${item.product.name}" style="width:40px; height:40px; object-fit:cover; border-radius:4px; margin-top:6px;">` : ""}
                    </td>
                    <td style="text-align:center; color:#4b5563;">${item.quantity}</td>
                    <td style="text-align:center;" class="price">${formatEGPPrice(item.price)}</td>
                    <td style="text-align:center;" class="price">${formatEGPPrice(item.price * item.quantity)}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>

          <!-- Price Summary -->
          <div class="section" style="background:#f8fafc; padding:16px; border-radius:8px;">
            <table style="width:100%; font-size:14px;">
              <tr>
                <td style="padding:4px 0; color:#4b5563;">Subtotal</td>
                <td style="text-align:right; color:#1f2937;">${formatEGPPrice(order.subTotal)}</td>
              </tr>
              <tr>
                <td style="padding:4px 0; color:#4b5563;">Shipping Cost</td>
                <td style="text-align:right; color:#1f2937;">${formatEGPPrice(order.shippingCost)}</td>
              </tr>
              ${
                order.discount > 0
                  ? `<tr>
                    <td style="padding:4px 0; color:#16a34a;">Discount</td>
                    <td style="text-align:right; color:#16a34a;">${formatEGPPrice(order.discount)}</td>
                  </tr>`
                  : ""
              }
              <tr class="total-row">
                <td style="padding:8px 0 0; border-top:1px dashed #d1d5db; color:#1f2937; font-weight:600;">
                  Total Amount
                </td>
                <td style="text-align:right; border-top:1px dashed #d1d5db; padding:8px 0 0; color:#1f2937; font-size:18px;">
                  ${formatEGPPrice(order.totalPrice)}
                </td>
              </tr>
            </table>
          </div>

          <!-- Shipping Address -->
          <div class="section">
            <span class="label">Shipping Address</span>
            <div class="value" style="background:#f9fafb; padding:12px; border-radius:6px; font-size:14px; line-height:1.5;">
              ${order.shippingAddress.city.name} - ${order.shippingAddress.city.country.name}<br>
              ${order.shippingAddress.address}<br>
              <small style="color:#6b7280;">Phone: ${order.shippingAddress.phone}</small>
            </div>
          </div>

          <!-- Update Timestamp -->
          <div class="section" style="font-size:13px; color:#6b7280;">
            <strong>Last updated:</strong> ${updatedAt}
          </div>

          <hr style="border:0; border-top:1px solid #e5e7eb; margin:28px 0;">

          <p style="font-size:13px; color:#6b7280; margin:0; line-height:1.5;">
            This is an automated update. We'll notify you of any further changes.<br>
            Questions? Contact us at 
            <a href="mailto:mostafa6320005@gmail.com" style="color:#7c3aed;">mostafa6320005@gmail.com</a>.
          </p>
        </div>

        <!-- Footer -->
        <div class="footer">
          <p style="margin:0; color:#9ca3af;">
            © ${new Date().getFullYear()} Cart Store. All rights reserved.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
  }
}
