import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import marked from 'marked'

import Link from 'next/link'

export default ({ topic, post, data, content }) => {
	const { title, description } = data

	return (
		<div>
			<Link href='/blog'>
				<a>Return to list of all posts</a>
			</Link>
			<div dangerouslySetInnerHTML={{ __html: content }} />
		</div>
	)
}

export const getStaticPaths = async () => {
	// Get all the folders in topic/
	const dirsNames = await fs.readdirSync('posts')

	// Get the path to each of them
	const dirsPaths = await dirsNames.map((dir) => {
		return path.join(process.cwd(), 'posts', dir)
	})

	const contentsList = []
	dirsPaths.map((pathToDir) => {
		const topic = path.basename(pathToDir)
		const postsWithExt = fs.readdirSync(pathToDir)
		postsWithExt.map((post) => {
			const postWithoutExt = post.replace('.md', '')
			contentsList.push({ topic, post: postWithoutExt })
		})
	})

	const paths = contentsList.map(({ topic, post }) => ({
		params: { topic, post },
	}))

	return {
		paths,
		fallback: false,
	}
}

export const getStaticProps = async ({ params: { topic, post } }) => {
	// get path to request post
	const postPath = await path.join(process.cwd(), 'posts', topic, post + '.md')

	// get post content
	const postContent = await fs.readFileSync(postPath).toString()

	// parse post
	const { data, content } = matter(postContent)

	// transform to HTML
	const postToHtml = marked(content)

	return {
		props: {
			topic,
			post,
			data,
			content: postToHtml,
		},
	}
}
