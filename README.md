**.... NOT READY YET ....**


# Bitfertig Blog [🔗](http://blog.bitfertig.de)



## Description

Database-less blog system. Every dir is an entry.


## How to work on a post

### Creating

Create a directory named with the topic of the post inside of "posts/".
Create to files in it
* posts/mytopic/post.json
* posts/mytopic/index.md

post.json has all relevant information of the post.
index.md is the content file of the post. Instead of markdown (index.md) there are other formats possible:
* index.md
* index.html

To watch changes of the post, run the following command:

```bash
npm run watch --post="git"
```

It will read the post.json file and process it to create a static HTML file in a folder like:
/public/mytopic/index.html.

And updates the sitemap.xml



## Author

🌐 [www.bitfertig.de](http://www.bitfertig.de)<br>
🌐 [www.twitter.com/bitfertig](https://twitter.com/bitfertig)
