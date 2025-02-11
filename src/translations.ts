export const translations = () => {
  const lang = ['en', 'zh', 'zh_TW'].includes(window.localStorage.getItem('language'))
    ? window.localStorage.getItem('language')
    : 'en';

  return {
    en: {
      allowed: 'allowed',
      notAllowed: 'not allowed',
      publishToMatters: 'Publish to Matters',
      upload: 'Upload',
      publish: 'Publish',
      viewOnMatters: 'View on Matters',
      draft: 'Draft',

      settings: {
        mattersSettings: 'Matters Settings',
        accessToken: 'Access Token',
        enterToken: 'Enter your Matters Town access token',
      },

      notices: {
        noActiveFile: 'No active file.',
        addedFrontmatter: 'Article settings added. Click again to upload.',
        invalidToken: 'Invalid or expired access token. Please update in settings.',
        failCollection: 'Failed to fetch article in collection:\n',
        uploadedDraft: 'Draft uploaded.',
        failUploadDraft: 'Failed to upload draft.',
        failPublishDraft: 'Failed to publish draft.',
      },

      frontmatter: {
        summary: 'Summary',
        tags: 'Tags',
        collection: 'Collection',
        license: 'License',
        allowComments: 'Comments',
      },
    },

    zh: {
      allowed: '允许',
      notAllowed: '不允许',
      publishToMatters: '发布到 Matters',
      publish: '发布',
      upload: '上传',
      viewOnMatters: '在 Matters 上查看草稿',
      draft: '草稿',

      settings: {
        mattersSettings: 'Matters 设置',
        accessToken: '密钥',
        enterToken: '输入 Matters Town 密钥',
      },

      notices: {
        noActiveFile: '没有选中文件',
        addedFrontmatter: '已添加文章设置\n再次点击上传草稿',
        invalidToken: '无效或过期的密钥\n请在设置中更新',
        failCollection: '无法识别关联文章:\n',
        uploadedDraft: '草稿已上传',
        failUploadDraft: '上传草稿失败',
        failPublishDraft: '发布草稿失败',
      },

      frontmatter: {
        summary: '摘要',
        tags: '标签',
        collection: '关联',
        license: '版权',
        allowComments: '评论',
      },
    },

    zh_TW: {
      allowed: '允許',
      notAllowed: '不允許',
      publishToMatters: '發布到 Matters',
      publish: '發布',
      upload: '上傳',
      viewOnMatters: '在 Matters 上查看草稿',
      draft: '草稿',
      settings: {
        mattersSettings: 'Matters 設置',
        accessToken: '密鑰',
        enterToken: '輸入 Matters Town 密鑰',
      },

      notices: {
        noActiveFile: '沒有選中文件',
        addedFrontmatter: '已添加文章設置\n再次點擊上傳草稿',
        invalidToken: '無效或過期的密鑰\n請在設置中更新',
        failCollection: '無法識別關聯文章:\n',
        uploadedDraft: '草稿已上傳',
        failUploadDraft: '上傳草稿失敗',
        failPublishDraft: '發布草稿失敗',
      },

      frontmatter: {
        summary: '摘要',
        tags: '標籤',
        collection: '關聯',
        license: '版權',
        allowComments: '評論',
      },
    },
  }[lang];
};
