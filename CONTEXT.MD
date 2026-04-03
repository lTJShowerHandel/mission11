Mission11 Assignment:
IS 413 – Hilton
Mission #11 Assignment
Jeff Bezos was 30 years old when he quit his job and founded Amazon in 1994, selling books
online out of his garage. His parents provided the seed money of $250,000. Amazon launched
their website in 1995, where revenue totaled $511,000 in their first five months. After receiving
an additional $8 million in funding in 1996, total revenue that year jumped up to $15.7 million.
The company went public in 1997, just shy of three years after the company was founded, and
Bezos made approximately $54 million in that IPO. By 1999, five years after starting Amazon,
Bezos made his first appearance on the Billionaires list. Bezos has said: “A brand for a company
is like a reputation for a person. You earn reputation by trying to do hard things well.”
It took a full year to develop, test, and debug the Amazon website. We are going to build a
similar app in just a few weeks using ASP.NET Core API / React over the course of the next few
assignments. This assignment focuses on creating the database portion of the web app.
Create a web app for an online bookstore. For each book, we want to store the following info:
• Title
• Author
• Publisher
• ISBN
• Classification/Category
• Number of Pages
• Price
All fields are required. Download the following database and connect it to the app:
https://byu.box.com/s/psbqlvg2yodpuby833w2t5dwinm567b8
Ensure that your models match the tables in the database. (NOTE: The database has been
prepopulated with some of Prof. Hilton’s favorite books he’s read or listened to in the past few
years.)
Build a component that lists out the information for each book in the database. Add pagination
to the app so that we list out 5 books per page for as many books as are in the database. Allow
the user to change the number of results per page. Add the component to the App.tsx file. Style
your page using Bootstrap.
Add the ability to allow the user to sort by book title. (#notcoveredinthevideos). Utilize AI to
help you learn how you can do it and then implement it.
Submit a link to the GitHub repository containing your assignment via Learning Suite.

Mission12 Assignment:
IS 413 – Hilton
Continue the Bookstore project from Mission #11. Following the pattern in the videos, build in
the ability for the user to filter by book categories (i.e. “Biography, “Self-Help”, etc.) The page
numbers should adjust based on the category selected.
Add the ability for the user to add books to their shopping cart. The cart should update the
quantity, price, subtotal, and total for each book that is added. The information should persist in
the cart for the duration of the session as the user navigates around. Include the functionality for
the user to “Continue Shopping” and go back to the page where they left off when they added the
item to their cart. Add a cart summary to the main book list page.
Arrange the website using the Bootstrap Grid. In addition, do two things with Bootstrap that we
have never done before in class. (#notcoveredinthevideos) With your submission link in
Learning Suite, make sure to add a comment with which bootstrap attributes you used so that the
TAs know what it is and where to find it. (NOTE: If you fail to add the comment, you will
receive no credit for that criteria in the rubric.) This is not meant to be a difficult requirement, so
please do not make it more than it is. I just want you to explore Bootstrap a little further and see
what kind of features are available.
Submit a pUbLiC link to the GitHub repository along with your comment about the
Bootstrap attributes you added via Learning Suite

---

Bootstrap Attributes Used (Mission 12 - "Not Covered in Class"):

1. TOAST NOTIFICATIONS (ToastNotification.tsx)
   Bootstrap's Toast component is a lightweight, dismissible notification popup.
   Classes used:
   - "toast-container position-fixed bottom-0 end-0 p-3"
       • toast-container: wrapper that positions and stacks toasts
       • position-fixed: takes the element out of normal flow and fixes it to the viewport
       • bottom-0 / end-0: pins the container to the bottom-right corner of the screen
   - "toast align-items-center text-bg-success border-0 show"
       • toast: the base toast component class; hidden by default, shown when "show" is added
       • text-bg-success: a contextual color helper that sets both text and background to the
         "success" (green) theme color
       • border-0: removes the default border
       • show: dynamically added via React to make the toast visible
   - "btn-close btn-close-white me-2 m-auto"
       • btn-close: renders a styled × dismiss button
       • btn-close-white: inverts the close icon to white so it's visible on a dark background
   Used in: src/components/ToastNotification.tsx
   Triggered: whenever a book is added to the cart, a green toast pops in the bottom-right
   corner and auto-dismisses after 3 seconds.

2. BADGES (CartPage.tsx, CartSummaryBar.tsx)
   Bootstrap Badges are small count/label indicators that attach inline to text or buttons.
   Classes used:
   - "badge bg-secondary ms-2"  (CartPage.tsx — item count next to "Shopping Cart" heading)
   - "badge bg-primary ms-1"    (CartSummaryBar.tsx — item count pill on the summary bar)
       • badge: base class; makes the element display as an inline pill with padding and
         rounded corners
       • bg-secondary / bg-primary: sets the badge background to Bootstrap's secondary (gray)
         or primary (blue) theme color
       • ms-1 / ms-2: margin-start (left margin) spacer utilities to separate the badge from
         the adjacent text
   Used in: src/components/CartPage.tsx (line 14) and
            src/components/CartSummaryBar.tsx (line 16)



Mission #13 Assignment
IS 413 - Hilton
Continuing the Bookstore app from Mission #12, create a new Git branch for
Phase #6.
Add the ability for the user to add, delete, and update books in the database.
Deploy the app to Azure.
NOTE: In order for the TAs to be able to navigate to your admin page, we need to
add a file on the front end. Remember that React is an SPA (Single Page
Application), so if we try to type in something like “/adminbooks” after the URL,
it will try to take the user to a different URL, rather than staying on the same page
and going to a different React route. In order to fix that, we add a file in the
“public” folder in React named “routes.json”, and then add the following code:
{
"routes": [
{
"route": "/*",
"serve": "/index.html",
"statusCode": 200
}
]
}
That will change the program so that routes like “/adminbooks” that come after the
URL will keep the same page, but use the React route instead.
Submit the link to your deployed website via Learning Suite. (If you did not
deploy the website, submit your GitHub link.)
