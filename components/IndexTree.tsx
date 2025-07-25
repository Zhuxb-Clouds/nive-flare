import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getMetaData } from "../utils/meta";

export interface TreeNode {
  key: string;
  title: string;
  children?: TreeNode[];
}

interface LinkTreeProps {
  treeData: TreeNode[];
}

interface TreeNodeProps {
  node: TreeNode;
  level: number;
  expandedKeys: string[];
  selectedKeys: string[];
  onToggle: (key: string) => void;
  onSelect: (key: string, isLeaf: boolean) => void;
}

const TreeNodeComponent = ({
  node,
  level,
  expandedKeys,
  selectedKeys,
  onToggle,
  onSelect,
}: TreeNodeProps) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedKeys.includes(node.key);
  const isSelected = selectedKeys.includes(node.key);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      onToggle(node.key);
    } else {
      onSelect(node.key, true);
    }
  };

  return (
    <div style={{ marginLeft: `${level * 16}px` }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "4px 8px",
          cursor: "pointer",
          backgroundColor: isSelected ? "var(--selection-bg)" : "transparent",
          borderRadius: "4px",
          margin: "2px 0",
        }}
        onClick={handleClick}
      >
        {hasChildren && (
          <span style={{ marginRight: "8px", fontSize: "12px" }}>
            {isExpanded ? "▼" : "▶"}
          </span>
        )}
        <span style={{ fontWeight: isSelected ? "bold" : "normal" }}>
          {node.title}
        </span>
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children?.map((child) => (
            <TreeNodeComponent
              key={child.key}
              node={child}
              level={level + 1}
              expandedKeys={expandedKeys}
              selectedKeys={selectedKeys}
              onToggle={onToggle}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function LinkTree({ treeData }: LinkTreeProps) {
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const router = useRouter();
  const currentUrl = router.asPath;

  const handleSelect = (key: string, isLeaf: boolean) => {
    // 如果与当前选中的相同，则不处理
    if (key === decodeURI(currentUrl).replace("/posts/", "")) return;

    setSelectedKeys([key]);

    if (isLeaf) {
      window.location.href =
        key === getMetaData().indexPath.replace(/\.md$/, "")
          ? "/"
          : `/posts/${key}`;
    }
  };

  const handleToggle = (key: string) => {
    setExpandedKeys(
      expandedKeys.includes(key)
        ? expandedKeys.filter((k) => k !== key)
        : [...expandedKeys, key]
    );
  };

  useEffect(() => {
    const path = window.location.pathname;
    if (path.includes("/posts/")) {
      const key = path.replace(/^\/posts\//, "").replace(/\.md$/, "");
      setExpandedKeys([decodeURI(key)]);
      setSelectedKeys([decodeURI(key)]);
    }
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", fontSize: "14px" }}>
      {treeData.map((node) => (
        <TreeNodeComponent
          key={node.key}
          node={node}
          level={0}
          expandedKeys={expandedKeys}
          selectedKeys={selectedKeys}
          onToggle={handleToggle}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}