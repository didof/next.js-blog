import fs from 'fs'
import path from 'path'

import Link from 'next/link'

export default ({ contentsList }) => {
	const separate = (list) => {
		const separated = []
		contentsList.forEach(({ topic, post }) => {
			if (!separated[topic]) {
				separated[topic] = [post]
			} else {
				separated[topic].push(post)
			}
		})
		return separated
	}

	const separatedContents = separate(contentsList)

	const list = Object.entries(separatedContents).map(([topic, posts]) => {
		const postPerTopic = posts.map((post, index) => (
			<li key={`${topic}-${post}-${index}`}>
				<Link
					href='/blog/[topic]/[post]'
					as={`/blog/${topic}/${post}`}
				>
					{post}
				</Link>
			</li>
		))

		return (
			<li key={topic}>
				<h1>{topic}</h1>
				<ul>{postPerTopic}</ul>
			</li>
		)
	})

	return (
		<div>
			<h1>Blog</h1>
			<ul>{list}</ul>
		</div>
	)
}

export const getStaticProps = async () => {
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

	return {
		props: {
			contentsList,
		},
	}
}
