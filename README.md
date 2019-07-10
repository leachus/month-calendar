# Month Calendar

This is a standalone react project that will work alongside existing installations of MBMD. It was built using Material UI and ReactJS. It supports a list view as well as the ability to view "only my shifts".

## Installation & Deployment

1. Clone this repo
2. Before building for a client site, there are a few settings that need to be set up in the package.json and one other place.

In package.json, you need to set these two settings to correspond to the site url and the directory where it's going to be deployed. For example, at our demo site, if deplying to a subdirectory `/month-cal` you would set the package.json up like so:

```json
{
  "homepage": "https://mbmd.microbloggingmd.com/month-cal",
  "proxy": "https://mbmd.microbloggingmd.com",
}
```

Finally, in App.js, you will want to make sure that the variable `const UseStaticData` is set to false. This is a development flag used for simulating real data with static data. If it is set incorrectly, the calendar will not fetch anything from the site's db.

3. In order to create a production build, from the project directory, run: `npm run build`. This will create a directory called **build** in the project directory. This folder is the one you will be copying over to the client's web server, the contents of which need to be deployed into whatever directory you specified in the package.json for "homepage".

4. Before deployment, there needs to be one template API created. It needs to be named **GetCallboardGroups**, set to **Authenticate By Session** and set as an API by checking the **This Template is an API** checkbox. Below is the code required in for SQL/View:

**SQL:**

```SQL
select NAME_WITH_TAG name, id from VW_MBMD_GROUPS where GROUP_TYPE = 'callboard' and id in (select * from dbo.getvisiblecallboards(@LAST_VALID_USER)) order by name
```
**View:**
```C#
<%
    //default api output: first sql query will be returned as JSON array.
    string output = "";
    output = ToJson(this.Table(0));
%>

<%=output%>
```

5. Finally, copy the files from the build directory over to the client webserver and you should be good to go.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

