import { Router } from "express";
import express, { Request, Response, NextFunction } from 'express';
import moment from 'moment';
import querystring from 'qs';
import crypto from 'crypto';

const config = {
  "vnp_TmnCode":"4OG4KT58",
  "vnp_HashSecret":"X69LLPOTNQ72T3BN04UMGPY0FD4F47Z5",
  "vnp_Url":"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
  "vnp_Api":"https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
  "vnp_ReturnUrl": "http://localhost:5173/payment-result"
}

const router = express.Router();

router.post('/create_payment_url', function (req: Request, res: Response, next: NextFunction) {
    
    process.env.TZ = 'Asia/Ho_Chi_Minh';
    
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    
    let ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        (req.connection as any).socket?.remoteAddress; // TS fix for nested socket

    
    let tmnCode = config.vnp_TmnCode;
    let secretKey = config.vnp_HashSecret;
    let vnpUrl = config.vnp_Url;
    let returnUrl = config.vnp_ReturnUrl;
    let orderId = moment(date).format('DDHHmmss');
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;
    
    let locale = req.body.language;
    if(locale === null || locale === ''){
        locale = 'vn';
    }
    let currCode = 'VND';
    let vnp_Params: { [key: string]: any } = {};
    
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = orderId;
    vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = ipAddr;
    vnp_Params['vnp_CreateDate'] = createDate;
    if(bankCode !== null && bankCode !== ''){
        vnp_Params['vnp_BankCode'] = bankCode;
    }

    vnp_Params = sortObject(vnp_Params);

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    // Chuyển new Buffer thành Buffer.from để phù hợp với Node.js mới và TS
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    res.status(200).json({ code: '00', message: 'Success', paymentUrl: vnpUrl });
});

router.get('/vnpay_return', function (req: Request, res: Response, next: NextFunction) {
    let vnp_Params = req.query;

    let secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    let tmnCode = config.vnp_TmnCode;
    let secretKey = config.vnp_HashSecret;

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     

    if(secureHash === signed){
        //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
        if (vnp_Params['vnp_ResponseCode'] === '00') {
            res.status(200).json({code: vnp_Params['vnp_ResponseCode'], message: 'Success'});
        } else {
            res.status(200).json({code: vnp_Params['vnp_ResponseCode'], message: 'Payment Failed/Canceled'});
        }
    } else{
        res.status(200).json({code: '97', message: 'Checksum failed'});
    }
});

function sortObject(obj: any) {
    let sorted: { [key: string]: string } = {};
    let str = [];
    let key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) {
        str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

export default router;