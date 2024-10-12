import { Tree } from "antd";
import type { TreeDataNode, TreeProps } from "antd";
import { useState } from "react";
import { getMetaData } from "../utils/meta";
import { useEffect } from "react";

export default function LinkTree({ treeData }: { treeData: TreeDataNode[] }) {
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);

  const onSelect: TreeProps["onSelect"] = (selectedKeys, info) => {
    // 如果是叶子节点，就跳转，否则展开/收起
    if (info.node.children?.length) {
      setExpandedKeys(
        expandedKeys.includes(info.node.key)
          ? expandedKeys.filter((key) => !key.toString().includes(info.node.key.toString()))
          : [...expandedKeys, info.node.key]
      );
    } else {
      window.location.href =
        selectedKeys[0] === getMetaData().indexPath.replace(/\.md$/, "")
          ? "/"
          : `/posts/${selectedKeys[0]}`;
    }
  };
  useEffect(() => {
    const path = window.location.pathname;
    console.log("path", path);
    if (path.includes("/posts/")) {
      const key = path.replace(/^\/posts\//, "").replace(/\.md$/, "");
      console.log("key", key);
      // %E5%85%B6%E4%BB%96/%E6%91%A9%E7%82%B9%E5%9B%BD%E4%BA%A7%E7%B1%BBGalgame%E6%B8%B8%E6%88%8F%E9%A1%B9%E7%9B%AE%E5%88%86%E6%9E%90
      // 将上面的转换为中文
      setExpandedKeys([decodeURI(key)]);
      setSelectedKeys([decodeURI(key)]);
    }
  }, []);

  const onExpand: TreeProps["onExpand"] = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
  };

  return (
    <Tree
      onSelect={onSelect}
      onExpand={onExpand}
      treeData={treeData}
      autoExpandParent
      blockNode
      expandedKeys={expandedKeys}
      selectedKeys={selectedKeys}
    />
  );
}
