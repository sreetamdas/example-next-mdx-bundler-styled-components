import fs from "fs";
import path from "path";
import { useMemo } from "react";
import { getMDXComponent } from "mdx-bundler/client";
import { bundleMDX } from "mdx-bundler";
import { GetStaticProps, InferGetStaticPropsType } from "next";

const Index = ({
	code,
	frontmatter,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
	const Component = useMemo(() => getMDXComponent(code), [code]);

	return (
		<>
			<header>
				<h1>{frontmatter.title}</h1>
				<p>{frontmatter.description}</p>
			</header>
			<main>
				<Component />
			</main>
		</>
	);
};

export default Index;

export const getStaticPaths = async () => {
	const postsData = await getBlogPostsSlugs();
	const paths = postsData.map((post) => ({
		params: { slug: post.slug },
	}));

	return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
	if (!params?.slug || Array.isArray(params?.slug)) return { props: {} };

	const postData = await getBlogPostData(params?.slug);

	return { props: { ...postData } };
};

const getBlogPostsSlugs = async () => {
	const DIR = path.join(process.cwd(), "content");
	const files = fs.readdirSync(DIR).filter((file) => file.endsWith(".mdx"));

	const postsData = files.map((file) => {
		const slug = file.replace(/\.mdx?$/, "");

		return {
			slug,
		};
	});

	return postsData;
};

const getBlogPostData = async (file: string) => {
	const DIR = path.join(process.cwd(), "content");
	const name = path.join(DIR, `${file}.mdx`);
	const mdxSource = fs.readFileSync(name, "utf8");
	const result = await bundleMDX(mdxSource);

	console.log({ result });
	return result;
};
