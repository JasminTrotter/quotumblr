//listens for user to input Tumblr username
//grabs the username input so it can be put in the url
function handleSignIn() {
  $('form').submit(function(event) {
    event.preventDefault();
    
    var usernameInput = $(this).find('.username-input');
    const endpoint = 'https://api.tumblr.com/v2/blog/';
    const rawUsername = usernameInput.val();
    const username = rawUsername.toLowerCase();
    const tumQuery = '/posts?type=text&api_key=s1TVfFskbRfOG1JUHLg8FGqqdJf4cvZtY89qYsbFjEQg44IGaz';
    const TUMBLR_URL = endpoint+username+tumQuery;
    
   getDataFromApi(TUMBLR_URL, getPostSummaries);

  });
}

//removes the About, Sign In, and Example modules
//adds a sign out button
function removeStartPage() {
    $('#start-page').remove();
    $('.sign-out').css('display', 'block');
}


function listenSignOut() {
  $('body').on('click', '.sign-out', function (event) {
    location.reload();
  });
}

//API stuff 

//can't get the data if user enters invalid username, so an error message displays in that case
function getDataFromApi(url, callback) {

  $.getJSON(url, callback).fail(()=> {
    alert('Invalid Username');
    $('.username-input').val('');
  });
}

//n is the post index; iterates in generatePostSelection
let n = 0;

//takes the data from getDataFromApi, 
//singles out the summary section of that data
//calls generatePostSelection to put the summary in radio form
function getPostSummaries(data) {
  removeStartPage();
  listenSignOut();
  const summaries = data.response.posts.map((item, index) => generatePostSelection(item.summary)).join(' ');

  renderPostSelection(summaries);
  handlePostSubmit();
}

//Each of the summaries to be put into a radio label
function generatePostSelection(summary) {
  n++;
  return `<div class="radio-content">
            <input class="radio-input" name="answer" type="radio" id="post${n}" aria-labelledby="radio_label" value="${summary}" required>
            <label for="post${n}" class="post-select">
              ${summary}
            </label>
          </div>`;
}

//Radio labels from `generatePostSelection` get put into the radio form here
function renderPostSelection(summaries) {
  const formHTML = `<div class="js-post-selection">
                      <div class="post-select-form"><div><h2>Pick a Post</h2></div>
                      <form>
                        <fieldset id="radio_label">${summaries}</fieldset>
                        <button type="submit" class="second-content">Submit</button>
                      </form>
                   </div> </div>`;
  $('.js-app-container').html(formHTML);
  
}

//usersChoice is going to be the post that the user selects
let usersChoice;

//the user's post section will be displayed, so we hide the post-selection radio form
function handlePostSubmit() {
   $('form').submit(function(event) {
    event.preventDefault();
    usersChoice = $('input[name="answer"]:checked').val();
    displayUsersChoice();
    $('.post-select-form').hide();
  listenGoBack();
  listenUserConfirmChoice();
   });
   
}


//usersChoice is the post that was selected by the user from the post-select radio form
function generateUsersChoice() {

  return `<div class="js-users-choice">
            <section class="main-content">
              <h2>You Have Chosen:</h2>
              <p>${usersChoice}</p>
            </section>
            <section class="second-content">
              <button class="go-back-button">Go Back</button>
              <button class="submit-users-choice" type="submit">Confirm</button>
              
            </section>
          </div>`;
          
}

function displayUsersChoice() {
  $('.users-choice-container').html(generateUsersChoice());
}

//user can click Go Back button to go back to the post-selection radio form
function listenGoBack() {
  $('.go-back-button').on('click', function(event) {
    $('.js-users-choice').remove();
    $('.post-select-form').show();
  });
}

//query is the word that is selected at random from the post
let query;

//creates the url to get the data from FAV Qs, using the random word chosen from usersChoice by chooseWord
function listenUserConfirmChoice() {
  $('.submit-users-choice').on('click', function(event) {
  const endpoint = 'https://favqs.com/api/quotes/?filter=';
  query = chooseWord(usersChoice);
  const FAVQs_URL= endpoint+query;
  
  getDataFromFAVQsApi(FAVQs_URL, displayQuote);
  });
}


function getDataFromFAVQsApi(url, callback) {

  const settings = {
    url: url,
    headers: {Authorization: 'Token token="0e5c0537686c9245f15249cdbb03c90d"'},
    dataType: 'json',
    type: 'GET',
    success: callback
  };

  $.ajax(settings);
}



//splits post string into words, divided at (/[ ,!.";:-]+/), creates an array with the words
function splitPost(post) {
  return post.toLowerCase().split(/[ ,!.";:-]+/).filter(Boolean).sort();
}

//chooses a random number that will be the index of word in the array 
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

//tried to list all the 'uninteresting' words so they will be filtered out from searching for quotes. This list may need more words to be added as we come across them.
let filterWords = ['a', 'as', 'he\'ll', 'but', 'its', 'this', 'the', 'an', 'am', 'so', 'he', 'she', 'and', 'there', 'that', 'here', 'on', 'no', 'yes', 'they', 'them', 'how', 'it', 'is', 'isn\'t', 'it\'s', 'for', 'be', 'also', 'been', 'into', 'may', 'to', 'by', 'her', 'hers', 'him', 'his', 'has', 'some', 'all', 'such', 'if', 'such', 'one', 'everybody', 'get', 'getting', 'got', 'ever', 'someone', 'everyone', 'both', 'either', 'neither', 'maybe', 'these', 'those', 'very', 'really', 'many', 'most', 'least', 'there\'s', 'herself', 'himself', 'themself', 'themselves', 'our', 'she\'ll', 'unto', 'go', 'only', 'i', 'me', 'mine', 'my', 'myself', 'ours', 'ourselves',  'is', 'are', 'we', 'do', 'of', 'not', 'you', 'who', 'can', 'can\'t', 'don\'t', 'would', 'in', 'to', 'wouldn\'t', 'could', 'couldn\'t', 'will', 'won\'t', 'had', 'there\'s', 'in', 'lorem', 'ipsum'];


function chooseWord(post) {
  let words = splitPost(post);
  let res = words.filter(f => !filterWords.includes(f));
  console.log(res);
  let word = res[getRandomInt(res.length)];
  return word;
}

//i is the index of the quote listed in the JSON returned from FAV Qs. i will iterate each time user requests a new quote (listened for by listenNewQuoteSameWord )
let i = 0;

//query is the word that is searched for in FAVQs. We want it highlighted in both the returned quote and the original post, which is done by .replace to wrap the query word in a span. We are making the post all lowercase because the query word won't be found in the post if it is capitalized in the post. If we had more time, we could find other workarounds that would allow us to retain the original capitalizations of words in the post. 
function displayQuote(data) { 

  const quote = data.quotes[i].body.replace(query, `<span style="background-color:#59B599;color:#171717;padding:3px;border-radius:2px">${query}</span>`);
  const author = data.quotes[i].author;
  const highlightedUsersChoice = usersChoice.toLowerCase().replace(query, `<span style="background-color:#59B599;color:#171717;padding:3px;border-radius:2px">${query}</span>`);
  $('.js-users-choice').remove();
  $('.quote-container').html(`<div class="js-quote-generated">
            <div class="js-quote-container">
              <article class="main-content quote-article">
           
                <h2>Here's Your Quote!</h2>
                <h3>"${quote}"</h3>
                <p>--${author}</p>
              
              </article>
            </div>
            
            <article class="main-content">
              <h2>Your Post</h2>
              ${highlightedUsersChoice}
            </article>
            
            <article class="second-content">
            <button class="new-quote-button">Generate New Quote with Same Word</button>
            
            <button class="js-change-post">Change Post Selection</button>
            </article>
            
          </div>`);
  
  listenNewQuoteSameWord(data);
  listenChangePost();
}


function listenNewQuoteSameWord(data) {
  $('.new-quote-button').on('click', function(event) {
    i++;
    const quote = data.quotes[i].body.replace(query, `<span style="background-color:#59B599;color:#171717;padding:3px;border-radius:2px">${query}</span>`);
    const author = data.quotes[i].author;
    $('.quote-article').remove();
    $('.js-quote-container').html(`
              <article class="main-content quote-article">
           
                <h2>Here's Your New Quote!</h2>
                <h3>"${quote}"</h3>
                <p>--${author}</p>
              
              </article>`);
  });
}

function listenChangePost() {
  $('.js-change-post').on('click', function(event) {
    $('.js-quote-generated').remove();
    $('.post-select-form').show();
  });
}

$(handleSignIn);