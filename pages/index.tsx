import Link from "next/link";
import type { NextPage } from "next";
import Head from "next/head";
import style from "../styles/home.module.css";
import type { postData } from "../components/postList";
import { getIndexContent, getPostTree } from "../utils/posts";
import { getMetaData } from "../utils/meta";
import { MDXRemote } from "next-mdx-remote";
import LinkTree from "../components/IndexTree";
import type { TreeNode } from "../components/IndexTree";


const homePage: NextPage<{ postData: postData; treeData: TreeNode[] }> = ({
  postData,
  treeData,
}) => {
  return (
    <div>
      <Head>
        <title>{getMetaData().title}</title>
      </Head>
      <div className={style.home}>
        <aside className={style.aside}>
          <div style={{ position: "sticky", top: "90px" }}>
            <LinkTree treeData={treeData} />
          </div>
        </aside>
        <article className={style.content}>
          <MDXRemote {...postData.content}></MDXRemote>
        </article>
      </div>
    </div>
  );
};
export default homePage;

export async function getStaticProps() {
  const postsData = await getIndexContent();
  const treeData = getPostTree();
  return {
    props: {
      postData: postsData,
      treeData,
    },
  };
}
