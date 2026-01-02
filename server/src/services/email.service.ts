import nodemailer from "nodemailer";
import { env } from "../utils/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendOrderConfirmation = async (
  toEmail: string,
  orderData: any
) => {
  try {
    const { id, totalAmount, orderItems, shippingAddress } = orderData;

    // Simple HTML Table for Items
    const itemsHtml = orderItems
      .map(
        (item: any) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.variant.product.name} (${item.variant.color}, ${item.variant.size})</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">$${item.price}</td>
      </tr>
    `
      )
      .join("");

    const mailOptions = {
      from: env.FROM_EMAIL,
      to: toEmail,
      subject: `Order Confirmation #${id} - Fashion Ecommerce`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for your order!</h2>
          <p>Hi there,</p>
          <p>Your order <strong>#${id}</strong> has been successfully placed.</p>
          
          <h3 style="background: #f4f4f4; padding: 10px;">Order Details</h3>
          <p><strong>Shipping Address:</strong> ${shippingAddress}</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background: #333; color: #fff;">
                <th style="padding: 8px; text-align: left;">Product</th>
                <th style="padding: 8px; text-align: left;">Qty</th>
                <th style="padding: 8px; text-align: left;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="2" style="padding: 8px; text-align: right; font-weight: bold;">Total:</td>
                <td style="padding: 8px; font-weight: bold;">$${totalAmount}</td>
              </tr>
            </tfoot>
          </table>

          <p style="margin-top: 30px; font-size: 12px; color: #666;">
            If you have any questions, please reply to this email.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("📧 Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return false;
  }
};
