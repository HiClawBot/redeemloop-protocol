# Merchant Admin and WooCommerce Pilot

## English

RedeemLoop v0.5.0 adds a local merchant admin console and improves the WooCommerce sandbox plugin for pilot setup.

### Merchant Admin Console

Run the API and POS console, then open:

```text
http://localhost:3000/merchant-admin
```

The console can:

- Load merchant vaults.
- Load Asset Bindings.
- Load PaymentIntents.
- Load webhook endpoints, events, and delivery records.
- Load audit logs.
- Seed a repeatable pilot merchant with one vault, entitlement, binding, and webhook endpoint.

This is a pilot operations console, not a hosted SaaS dashboard. It is intended for sandbox operators and early merchant trials.

### WooCommerce Pilot Improvements

The WooCommerce plugin now supports:

- Admin diagnostics showing API base URL, merchant ID, default binding ID, and webhook endpoint.
- A **Test RedeemLoop connection** action for API credential checks and webhook secret HMAC self-test.
- Optional SKU-to-binding mapping with one `sku=bindingId` entry per line.
- Fallback to the default binding when no SKU mapping matches.
- Order-received diagnostics showing order status, PaymentIntent ID, and selected binding.

Example SKU map:

```text
coffee-cup=bind_coffee
vip-ticket=bind_vip_ticket
```

### Pilot Path

1. Start the RedeemLoop API.
2. Open `/merchant-admin`.
3. Seed or inspect merchant data.
4. Configure WooCommerce with API Base URL, Merchant ID, API Key, Default Binding ID, Webhook Secret, and optional SKU map.
5. Place a WooCommerce test order.
6. Complete voucher payment on the order-received page.
7. Confirm PaymentIntent, webhook delivery, and audit log records in merchant admin.

## 中文

RedeemLoop v0.5.0 新增本地 merchant admin console，并改进 WooCommerce sandbox plugin 的 pilot 配置体验。

### Merchant Admin Console

启动 API 和 POS console 后打开：

```text
http://localhost:3000/merchant-admin
```

控制台可以：

- 加载 merchant vaults。
- 加载 Asset Bindings。
- 加载 PaymentIntents。
- 加载 webhook endpoints、events 和 delivery records。
- 加载 audit logs。
- Seed 一组可重复 pilot merchant 数据，包括 vault、entitlement、binding 和 webhook endpoint。

这是 pilot operations console，不是托管 SaaS dashboard。它用于 sandbox operator 和早期商户试点。

### WooCommerce Pilot 改进

WooCommerce plugin 现在支持：

- 后台诊断显示 API base URL、merchant ID、default binding ID 和 webhook endpoint。
- **Test RedeemLoop connection** 操作，用于检查 API 凭证和 webhook secret HMAC 自检。
- 可选 SKU-to-binding mapping，每行一个 `sku=bindingId`。
- SKU 未命中时回退到 default binding。
- Order-received 诊断会显示订单状态、PaymentIntent ID 和选中的 binding。

SKU map 示例：

```text
coffee-cup=bind_coffee
vip-ticket=bind_vip_ticket
```

### Pilot 路径

1. 启动 RedeemLoop API。
2. 打开 `/merchant-admin`。
3. Seed 或检查 merchant 数据。
4. 在 WooCommerce 中配置 API Base URL、Merchant ID、API Key、Default Binding ID、Webhook Secret 和可选 SKU map。
5. 创建 WooCommerce 测试订单。
6. 在 order-received 页面完成 voucher payment。
7. 在 merchant admin 中确认 PaymentIntent、webhook delivery 和 audit log 记录。
