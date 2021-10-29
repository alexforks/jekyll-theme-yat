// 1. Import Dependencies. =====================================================
import React from 'react';
import {
  SearchBox,
  SearchkitManager,
  SearchkitProvider,
  RefinementListFilter,
  InitialLoader,
  Hits,
  HitsStats,
  NoHits,
  Pagination
} from "searchkit";
import * as _ from "lodash";

const GetToken = (url) => {
  let items = [];
  if (url) {
    items = url.split("//");
      if (items.length > 1) {
        items = items[1].split("@");
          if (items.length > 0) {
            items = items[0].split(":");
          }
      }
  }
  return items.join(":");
}

// 2. Connect elasticsearch with searchkit =====================================
// Set ES url - use a protected URL that only allows read actions.
const token = PROTECTD_ELASTICSEARCH_URL ? GetToken(PROTECTD_ELASTICSEARCH_URL) : "";
const url = PROTECTD_ELASTICSEARCH_URL ? PROTECTD_ELASTICSEARCH_URL.replace(token + "@", "") : "";
const sk = new SearchkitManager(
  url,
  {
    searchOnLoad:false,
    basicAuth:token
  });

// Custom hitItem display HTML.
const HitItem = (props) => (
  <div className={props.bemBlocks.item().mix(props.bemBlocks.container("item"))}>
    <a href={ `${props.result._source.url}` }>
      <div className={props.bemBlocks.item("title")}
        dangerouslySetInnerHTML={{__html:_.get(props.result,"highlight.title",false) || props.result._source.title}}></div>
    </a>
    <div>
      <small className={props.bemBlocks.item("highlights")}
        dangerouslySetInnerHTML={{__html:_.get(props.result,"highlight.text",'')}}></small>
    </div>
  </div>
);

// 3. Search UI. ===============================================================
const SearchUI = () => {
  const queryOpts = {
    analyzer:"standard"
  };

  return (
    <SearchkitProvider searchkit={sk}>
      <div>
        <div className="sk-layout__top-bar">
          {/* search input box */}
          <SearchBox searchOnChange={true}
                     autoFocus={true}
                     queryOptions={queryOpts}
                     translations={{
                       "searchbox.placeholder": "Type to Search ...",
                       "NoHits.DidYouMean": "Search for {suggestion}."
                     }}

                     queryFields={["text", "title", "tags"]}/>
        </div>
        <InitialLoader/>
        <HitsStats/>
        <Pagination showNumbers={true}/>
        <div className="sk-layout__body">
          <div className="sk-layout__filters">
            {/* search faceting */}
            <RefinementListFilter
              id="categories"
              title="Category"
              field="categories.keyword"
              operator="AND"/>
          </div>
          <div className="sk-layout__results">
            {/* search results */}
            <Hits hitsPerPage={10}
                  highlightFields={["title", "text"]}
                  customHighlight={{"fragment_size":30}}
                  itemComponent={HitItem}/>
            {/* if there are no results */}
            <NoHits className="sk-hits" translations={{
              "NoHits.NoResultsFound": "No results were found for {query}",
              "NoHits.DidYouMean": "Search for {suggestion}"
            }} suggestionsField="text"/>
          </div>
        </div>
        <div className="sk-layout__footer">
          Powered by
          &nbsp;<a href="https://searchkit.co" target="_blank">Searchkit</a>&nbsp;,
          &nbsp;<a href="https://www.elastic.co/" target="_blank">Elasticesearch</a>&nbsp;,&nbsp;&
          &nbsp;<a href="https://github.com/omc/searchyll" target="_blank">Searchyll</a>.
        </div>
      </div>
    </SearchkitProvider>
  )
};
export default SearchUI;
