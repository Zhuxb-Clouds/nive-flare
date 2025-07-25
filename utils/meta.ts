import metaData from "../posts/meta.json"

// 默认元数据
const defaultMetaData = {
  title: "NiveFlare",
  logo: "Docs",
  indexPath: "",
  avatar: ""
};

// 定义元数据类型
type MetaData = typeof defaultMetaData;

// 缓存变量
let cachedMetaData: MetaData | null = null;

export function getMetaData(): MetaData {
  // 如果缓存存在，直接返回缓存
  if (cachedMetaData !== null) {
    return cachedMetaData;
  }


  try {
    cachedMetaData = {
      ...defaultMetaData,
      ...metaData
    };
    return cachedMetaData as MetaData;
  } catch (error) {
    console.error('Failed to read meta.json, using default metadata:', error);
    cachedMetaData = defaultMetaData;
    return cachedMetaData;
  }
}