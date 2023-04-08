// this script is used for generating a PB.md file by exporting from JIRA

// STEP 1: Make a search in JIRA for the LUK project `project = LUK`

// STEP 2: Export the search result as HTML (All fields) 
// reference: https://confluence.atlassian.com/jiracoreserver073/working-with-search-results-861257284.html#Workingwithsearchresults-Exportingyoursearchresults

// STEP 3: Open the html file you should have downloaded from jira and open the chrome console (inspect element)

// STEP 4: Paste this code into your console and run the generate function with the current sprint number, ie sprint number is 2, run `generate(2)`

// STEP 5: Copy the html element that is printed out into a html file on your computer

// STEP 6: Use the pandoc command: pandoc jiratable.html -f html -t markdown -s -o jira.md 
//         This will convert your parsed html to a markdown file :) 
// STEP 7: profit

let generate = (sprintNumber) => {
    let rows = [];
    let jira = document.createElement('div');
    
    document.querySelector("#issuetable").querySelectorAll(".issuerow").forEach((row) => { 
                r = {
                    "link": row.querySelector('.issue-link').href,
                    "link-text": row.querySelector('.issue-link').textContent,
                    "summary": row.querySelector('.summary').textContent.trim(),
                    "issueType": row.querySelector('.issueType').textContent.trim(),                
                    "description": row.querySelector('.description').textContent.trim(),
                    "story-points": row.querySelector('.customfield_10200').textContent.trim(),
                    "sprint": row.querySelector('.customfield_10105').textContent.trim(),
                    "priority": row.querySelector('.priority').textContent.trim(),
                };
                rows.push(r);
        }
    );
    
    let sprint = (n, sprint) => {
        return sprint === '' || parseInt(sprint.slice(-1)) >= n;
    };
    
    
    let afterSprint1 = (r) => {return r.issueType === 'Story' && sprint(2, r["sprint"])};
    let beforeSprint1 = (r) => {return r.issueType === 'Story' && !sprint(2, r["sprint"])};
    
    let getRows = (predicate) => {
        return rows.filter((r) => predicate(r)).map((r) => {
            rowDiv = document.createElement('p');
            link  = document.createElement('a');
            link.textContent = r['link-text'];
            link.href = r['link'];
    
            summary = document.createElement('strong');
            summary.textContent = r["summary"];
    
            description = document.createElement('p');
            description.textContent = r["description"]; 
    
    
            descText = document.createElement('strong');
            descText.textContent = "Description";
    
    
            rowDiv.append(link);
            rowDiv.append(document.createElement('br'));
    
            rowDiv.append(summary);
            rowDiv.append(document.createElement('br'));
            rowDiv.append(document.createElement('br'));
            rowDiv.append(descText);
    
            rowDiv.append(description);
    
            return rowDiv;
        });
    }
    
    let pbDivs = getRows(afterSprint1);
    let completed = getRows(beforeSprint1);
    
    
    pbText = document.createElement("h1");
    pbText.textContent = "Stories in Backlog";
    jira.appendChild(pbText);
    pbDivs.forEach((r) => {jira.appendChild(r);});
    compText = document.createElement("h1");
    compText.textContent = "Completed Stories";
    jira.appendChild(compText);
    completed.forEach((r) => {jira.appendChild(r);});
    console.log(jira);
}

