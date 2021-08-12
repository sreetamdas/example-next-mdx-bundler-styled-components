import fs from "fs";
import path from "path";
import { useEffect } from "react";

const Index = ({ post }) => {
	useEffect(() => {
		console.log(post);
	}, [post]);

	return (
		<div>
			<h1>Hello world!</h1>
		</div>
	);
};

export default Index;

export const getStaticPaths = async () => {
	const postsData = await getBlogPostsData();

	const paths = postsData.map((post) => ({
		params: { slug: post.slug },
	}));

	return { paths, fallback: false };
};

export const getStaticProps = async ({ params }) => {
	const postsData = await getBlogPostsData();
	const post = postsData.find((postData) => postData.slug === params?.slug)!;

	return { props: { post } };
};

const getBlogPostsData = async () => {
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
