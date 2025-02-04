export const translations = () => {
  const lang = ['en', 'zh', 'zh_TW'].includes(window.localStorage.getItem('language'))
    ? window.localStorage.getItem('language')
    : 'en';

  return {
    en: {
      publishToMatters: 'Publish to Matters',

      settings: {
        mattersSettings: 'Matters Settings',
        accessToken: 'Access Token',
        enterToken: 'Enter your Matters Town access token',
      },

      notices: {
        noActiveFile: 'No active file.',
        addedFrontmatter: 'Article settings added. Click again to upload.',
        invalidToken: 'Invalid or expired access token. Please update in settings.',
      },

      frontmatter: {
        summary: 'Summary',
        tags: 'Tags',
        collection: 'Collection',
        license: 'License',
        allowComments: 'Allow Comments',
      },
    },

    zh: {
      publishToMatters: '发布到 Matters',

      settings: {
        mattersSettings: 'Matters 设置',
        accessToken: '密钥',
        enterToken: '输入 Matters Town 密钥',
      },

      notices: {
        noActiveFile: '没有选中文件',
        addedFrontmatter: '已添加文章设置\n再次点击上传草稿',
        invalidToken: '无效或过期的密钥\n请在设置中更新',
      },

      frontmatter: {
        summary: '摘要',
        tags: '标签',
        collection: '关联',
        license: '版权',
        allowComments: '允许评论',
      },
    },

    zh_TW: {
      publishToMatters: '發布到 Matters',

      settings: {
        mattersSettings: 'Matters 設置',
        accessToken: '密鑰',
        enterToken: '輸入 Matters Town 密鑰',
      },

      notices: {
        noActiveFile: '沒有選中文件',
        addedFrontmatter: '已添加文章設置\n再次點擊上傳草稿',
        invalidToken: '無效或過期的密鑰\n請在設置中更新',
      },

      frontmatter: {
        summary: '摘要',
        tags: '標籤',
        collection: '關聯',
        license: '版權',
        allowComments: '允許評論',
      },
    },
  }[lang];
};
