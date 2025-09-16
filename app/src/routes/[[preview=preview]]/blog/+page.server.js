import { createClient } from 'root/src/lib/prismicio';

const fetchRSSFeeds = async (fetch) => {
	const response = await fetch('/api/feed');
	const feed = response.json();
	return feed;
};

export async function load({ fetch, cookies }) {
	const client = createClient({ fetch, cookies });
	const page = await client.getSingle('blog_hub');
	const feeds = await fetchRSSFeeds(fetch);

	return {
		page,
		feeds,
		meta_title: page.data.meta_title,
		meta_description: page.data.meta_description
	};
}

export async function entries() {
	const client = createClient();
	const page = await client.getSingle('blog_hub');
	return [{ uid: page.uid }];
}
