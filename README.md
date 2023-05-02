# node-blog-backend Mongo
Saves blogs on in mongo DB
<h2>Setup</h2>
- Run "npm i" to install dependencies. <br>
- Set up mongo connection in api/db.js ** NEEDS LAYOUT OF 'DB > blog' **
- Hash new username and passwords for the dashboard in auth/login.js <br>
- Set up IMGUR API and put Client ID in secure/dashboard/blogbuilder.html and secure/dashboard/blogeditor.html <br>
- Add WHITELISTED server to CORS in "app.js" <br><br>

- Add to the frontend's style.css to get custom fonts in TinyMCE - @import url('https://fonts.googleapis.com/css2?family=Comic+Neue:wght@300;400;700&family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Inspiration&family=Lobster&display=swap');

- Can Use NCC to compile. <br>
- Compiled/Bundled with NCC "ncc build app.js -o dist" <br>

<strong>Public Routes:</strong>
- api/blogmetadata (GET) : Returns all blog metadata

- api/blogbyid/:id (GET) : Returns Blog metadata/content matching :id.

- api/latestblogs/:amount (GET) : Returns metadata of AMOUNT most recent blogs.

- api/blogcategories (GET) : returns an array containing all existing blog categories.

- api/blogsanddrafts (GET) : Returns all current Blogs and drafts up to limit set in js file

- api/drafts (GET) : Returns all draft metadata

<strong>Secure Routes:</strong>

- api/blogs (POST) : creates or edits blog

- api/deleteblog/:id (DELETE) : Delete blog matching :id.
