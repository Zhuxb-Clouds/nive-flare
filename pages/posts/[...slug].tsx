import type { GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";

import { getAllPostParams, getPostData, getPostTree } from "../../utils/posts";
import homeStyle from "../../styles/home.module.css";
import Tag from "../../components/tag";
import Date from "../../components/date";
// 引入代码高亮css
import { MDXRemote, MDXRemoteProps } from "next-mdx-remote";
import "prismjs/themes/prism-okaidia.min.css";
import style from "./post.module.css";
import LinkTree, { TreeNode } from "../../components/IndexTree";
interface Props {
  postData: {
    title: string;
    date: string;
    content: MDXRemoteProps;
    tags: string[];
  };
  treeData: TreeNode[];
}

export default function Post({ postData, treeData }: Props) {
  return (
    <div>
      <Head>
        <title>{postData.title}</title>
      </Head>
      <div className={homeStyle.home}>
        <aside className={homeStyle.aside}>
          <div style={{ position: "sticky", top: "90px" }}>
            <LinkTree treeData={treeData} />
          </div>
        </aside>
        <section style={{ flex: 1 }}>
          <h1 className={style.title}>{postData.title}</h1>
          <div className={style.tags}>
            {postData.tags.map((item) => (
              <Tag tagName={item} key={item} />
            ))}
          </div>
          <Date date={postData.date} className={style.time} />
          <article className={style.content}>
            <MDXRemote {...postData.content}></MDXRemote>
          </article>
        </section>
      </div>
    </div>
  );
}

// getStaticProps和getStaticPaths只在服务器端运行，永远不会在客户端运行
export const getStaticPaths: GetStaticPaths = async () => {
  // 获取所有文章id，即所有路由
  const paths = getAllPostParams();
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // 获取文章内容

  const postData = await getPostData(params!.slug as string[]);
  const treeData = getPostTree();
  return {
    props: {
      postData,
      treeData,
    },
  };
};
