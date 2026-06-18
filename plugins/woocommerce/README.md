# RedeemLoop WooCommerce Sandbox Plugin

## English

This directory contains a sandbox WooCommerce payment gateway for RedeemLoop voucher payments.

Install:

1. Copy `redeemloop-voucher-gateway.php` into `wp-content/plugins/redeemloop-voucher-gateway/`.
2. Activate **RedeemLoop Voucher Gateway** in WordPress.
3. Open WooCommerce payment settings and enable **RedeemLoop Voucher**.
4. Configure:
   - RedeemLoop API Base URL.
   - Merchant ID.
   - API Key.
   - Default Binding ID.
   - Optional SKU to Binding Map, one `sku=bindingId` per line.
   - Webhook Secret.
   - Optional widget script URL.
5. Click **Test RedeemLoop connection** to check API credentials and webhook secret HMAC configuration.

Webhook endpoint:

```text
POST /wp-json/redeemloop/v1/woocommerce/mark-paid
```

RedeemLoop webhook signatures must use:

```text
X-RedeemLoop-Timestamp
X-RedeemLoop-Nonce
X-RedeemLoop-Signature = hex(hmac_sha256(secret, timestamp + "." + nonce + "." + rawBody))
```

Current limits:

- Sandbox plugin only; not submitted to the WordPress plugin directory.
- The checkout flow creates a PaymentIntent and shows a widget container on the order-received page.
- The order-received page shows order status, PaymentIntent ID, and selected binding for pilot diagnostics.
- The plugin can map product SKUs to different RedeemLoop bindings and falls back to the default binding.
- Production stores should host a bundled `@redeemloop/widget` script and use HTTPS.

## 中文

本目录包含 RedeemLoop 提货券支付的 WooCommerce sandbox payment gateway。

安装：

1. 将 `redeemloop-voucher-gateway.php` 复制到 `wp-content/plugins/redeemloop-voucher-gateway/`。
2. 在 WordPress 后台启用 **RedeemLoop Voucher Gateway**。
3. 打开 WooCommerce 支付设置，启用 **RedeemLoop Voucher**。
4. 配置：
   - RedeemLoop API Base URL。
   - Merchant ID。
   - API Key。
   - Default Binding ID。
   - 可选 SKU to Binding Map，每行一个 `sku=bindingId`。
   - Webhook Secret。
   - 可选 widget script URL。
5. 点击 **Test RedeemLoop connection**，检查 API 凭证和 webhook secret HMAC 配置。

Webhook endpoint：

```text
POST /wp-json/redeemloop/v1/woocommerce/mark-paid
```

RedeemLoop webhook 签名规则：

```text
X-RedeemLoop-Timestamp
X-RedeemLoop-Nonce
X-RedeemLoop-Signature = hex(hmac_sha256(secret, timestamp + "." + nonce + "." + rawBody))
```

当前限制：

- 仅为 sandbox 插件，尚未提交 WordPress plugin directory。
- checkout 流程会创建 PaymentIntent，并在 order-received 页面展示 widget 容器。
- order-received 页面会显示订单状态、PaymentIntent ID 和选中的 binding，方便 pilot 诊断。
- 插件可以把不同商品 SKU 映射到不同 RedeemLoop binding，未命中时使用 default binding。
- 生产店铺应自行托管打包后的 `@redeemloop/widget` script，并使用 HTTPS。
