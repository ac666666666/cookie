# 发布到 Microsoft Edge 指南

## 1. 准备工作

我已经为您生成了发布所需的打包文件：
**文件位置**: `D:\谷歌插件\ac-storage-manager-v1.0.0.zip`

除了这个安装包，您还需要准备以下素材（商店展示用）：
*   **商店 Logo**: 300 x 300 像素的 PNG 图片。
*   **小型宣传磁贴**: 440 x 280 像素的 PNG 图片。
*   **大型宣传磁贴**: 1400 x 560 像素的 PNG 图片。
*   **截图**: 至少 1 张插件运行截图（建议尺寸 1280x800 或 640x400）。

## 2. 注册开发者账号

1.  访问 **Microsoft Partner Center** (微软合作伙伴中心): [https://partner.microsoft.com/dashboard/microsoftedge/public/login.ref](https://partner.microsoft.com/dashboard/microsoftedge/public/login.ref)
2.  使用您的微软账号登录。
3.  如果您是第一次登录，需要注册为开发者（个人开发者通常是免费的或只需支付一次性小额费用，具体视政策而定）。

## 3. 提交扩展

1.  在仪表板中，点击 **"新建扩展" (Create new extension)**。
2.  上传我们生成的 `ac-storage-manager-v1.0.0.zip` 文件。
3.  **可用性 (Availability)**: 选择 "公开" (Public) 以便所有人都能下载，或者选择 "隐藏" (Hidden) 进行测试。
4.  **属性 (Properties)**:
    *   **类别**: 选择 "开发者工具" (Developer tools)。
    *   **隐私政策**: 如果只是本地运行且不收集数据，可以填写您的个人博客地址或生成一个简单的隐私政策页面。
5.  **应用商店列表 (Store Listing)**:
    *   填写描述（可以用中文）。
    *   上传之前准备好的 Logo、宣传图和截图。
6.  **完成提交**: 点击 "发布" (Publish)。

## 4. 审核

提交后，微软通常会在 24-72 小时内完成审核。审核通过后，您的插件就会出现在 Microsoft Edge Add-ons 商店中。
