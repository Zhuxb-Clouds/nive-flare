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
          : `/posts/${info.node.key}`;
    }
  };
  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("/posts/")) {
      const key = path.replace(/^\/posts\//, "").replace(/\.md$/, "");
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
