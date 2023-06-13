import React, { useEffect, useState } from 'react';
import CardList from './components/cardlist';
import { Container, Segment } from 'semantic-ui-react';
import SearchBar from './components/searchBar';
import './components/features.css'

const App = () => {
  const [ texts, setTexts ] = useState([]);
  const [ filteredTexts, setFilteredTexts ] = useState([]);

  const fetchItems = () => {
    const items = localStorage.getItem('items');
    if (items) {
      setTexts(JSON.parse(localStorage.getItem('items')));
      setFilteredTexts(JSON.parse(localStorage.getItem('items')));
    } else {
      const timelineData = [
        {
          content: "First presidential debate between Donald Trump and Hillary Clinton",
          date: "September 26, 2016",
          tags: "debate, Trump, Clinton"
        },
        {
          content: "Release of Access Hollywood tape, causing controversy for Donald Trump",
          date: "October 7, 2016",
          tags: "scandal, Trump, controversy"
        },
        {
          content: "Second presidential debate between Donald Trump and Hillary Clinton",
          date: "October 9, 2016",
          tags: "debate, Trump, Clinton"
        },
        {
          content: "Third presidential debate between Donald Trump and Hillary Clinton",
          date: "October 19, 2016",
          tags: "debate, Trump, Clinton"
        },
        {
          content: "FBI Director James Comey announces reopening of investigation into Hillary Clinton's private email server",
          date: "October 28, 2016",
          tags: "FBI, Clinton, email"
        },
        {
          content: "FBI Director James Comey announces no new evidence to warrant charges against Hillary Clinton",
          date: "November 6, 2016",
          tags: "FBI, Clinton, email"
        },
        {
          content: "Presidential election day",
          date: "November 8, 2016",
          tags: "election, voting"
        },
        {
          content: "Donald Trump elected as the 45th President of the United States",
          date: "November 9, 2016",
          tags: "election, Trump, victory"
        },
        {
          content: "Hillary Clinton concedes the election",
          date: "November 9, 2016",
          tags: "election, Clinton, concession"
        },
        {
          content: "Inauguration of Donald Trump as President of the United States",
          date: "January 20, 2017",
          tags: "inauguration, Trump"
        },
        {
          content: "Women's March on Washington in protest of President Trump",
          date: "January 21, 2017",
          tags: "protest, Women's March, Trump"
        },
        {
          content: "President Trump signs executive order to temporarily ban travel from seven Muslim-majority countries",
          date: "January 27, 2017",
          tags: "Trump, executive order, travel ban"
        },
        {
          content: "Resignation of National Security Advisor Michael Flynn",
          date: "February 13, 2017",
          tags: "resignation, Flynn"
        },
        {
          content: "Confirmation of Neil Gorsuch as Supreme Court Justice",
          date: "April 7, 2017",
          tags: "Supreme Court, Gorsuch, confirmation"
        },
        {
          content: "Firing of FBI Director James Comey by President Trump",
          date: "May 9, 2017",
          tags: "FBI, Trump, Comey"
        },
        {
          content: "Appointment of Robert Mueller as special counsel to investigate Russian interference in the election",
          date: "May 17, 2017",
          tags: "Mueller, investigation, Russia"
        },
        {
          content: "Senate passes tax reform bill",
          date: "December 2, 2017",
          tags: "tax reform, Senate"
        },
        {
          content: "State of the Union address by President Trump",
          date: "January 30, 2018",
          tags: "State of the Union, Trump"
        },
        {
          content: "Facebook reveals Cambridge Analytica data scandal",
          date: "March 17, 2018",
          tags: "scandal, Facebook, Cambridge Analytica"
        },
        {
          content: "Meeting between President Trump and North Korean leader Kim Jong-un",
          date: "June 12, 2018",
          tags: "Trump, Kim Jong-un, meeting"
        },
        {
          content: "Confirmation of Brett Kavanaugh as Supreme Court Justice",
          date: "October 6, 2018",
          tags: "Supreme Court, Kavanaugh, confirmation"
        },
        {
          content: "Democrats gain majority in the House of Representatives in midterm elections",
          date: "November 6, 2018",
          tags: "midterm elections, House of Representatives, Democrats"
        },
        {
          content: "Release of the Mueller Report",
          date: "April 18, 2019",
          tags: "Mueller Report, investigation"
        },
        {
          content: "Impeachment inquiry against President Trump initiated by the House of Representatives",
          date: "September 24, 2019",
          tags: "impeachment, inquiry, House of Representatives"
        },
        {
          content: "Senate acquits President Trump in impeachment trial",
          date: "February 5, 2020",
          tags: "impeachment, trial, Senate"
        },
        {
          content: "COVID-19 pandemic leads to changes in election processes",
          date: "2020",
          tags: "COVID-19, pandemic, election"
        },
        {
          content: "Joe Biden selected as the Democratic nominee for President",
          date: "August 18, 2020",
          tags: "Biden, Democratic nominee"
        },
        {
          content: "First presidential debate between Joe Biden and Donald Trump",
          date: "September 29, 2020",
          tags: "debate, Biden, Trump"
        },
        {
          content: "Joe Biden elected as the 46th President of the United States",
          date: "November 7, 2020",
          tags: "election, Biden, victory"
        },
        {
          content: "Inauguration of Joe Biden as President of the United States",
          date: "January 20, 2021",
          tags: "inauguration, Biden"
        },
        {
          content: "Second impeachment of President Trump by the House of Representatives",
          date: "January 13, 2021",
          tags: "impeachment, Trump, House of Representatives"
        },
        {
          content: "Senate acquits President Trump in second impeachment trial",
          date: "February 13, 2021",
          tags: "impeachment, trial, Senate"
        }
      ];
      localStorage.setItem('items',JSON.stringify(timelineData));
      setTexts(JSON.parse(localStorage.getItem('items')));
      setFilteredTexts(JSON.parse(localStorage.getItem('items')));
    }
  }

  useEffect(()=>{
    fetchItems()
  },[])

  const onSearch = (search) => {
    if (search === '') {
      setFilteredTexts(texts);
      return
    };
    const searchTerm = search.trim().toLowerCase();
    const regex = new RegExp(searchTerm, 'i');

    const filteredTexts = texts.filter((text) => {
      const lowercaseTags = text.tags?.toLowerCase();
      const lowercaseDate = text.date?.toLowerCase();
      const lowercaseContent = text.content?.toLowerCase();
  
      return (
        (lowercaseTags && regex.test(lowercaseTags)) ||
        (lowercaseDate && regex.test(lowercaseDate)) ||
        (lowercaseContent && regex.test(lowercaseContent))
      );
    });
  
    setFilteredTexts(filteredTexts);
  };  
  

  return (
    <Container style={{height:"100vh"}}>
      <Segment basic padded='very'>
      <SearchBar onSearch={onSearch}/>
      </Segment>
      <Segment vertical style={{ height: '80vh', overflowY: 'auto'}}>
        {filteredTexts && <CardList texts={filteredTexts} setTexts={setFilteredTexts} />}
      </Segment>
    </Container>
  );
};

export default App;
