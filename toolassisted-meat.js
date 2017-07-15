var CHARPLUS = "&middot;";	// the symbol that represents a single frame on the Grid (a middle dot)
var CHARMINUS = "&middot;";
var MEOKI = 1;              // the currently selected OKI row. (OKI move #, in chronological order)
var KDMOVE = null;          // array of strings containing the currently selected KD move's framedata
var OKIMOVE = null;
var FRAMEKILL = 19;
var HASHKD = 68+1;
var HASHKDBR = 24+1;
var HASHKDR = 19+1;
var HASHCHAR = "ED";
var HASHSTARTUP = 5;
var HASHACTIVE = 4;
var HASHRECOVERY = 10;
var HASHLIST = [];
/*
 * The current OKI Setup. 
 */
var OKILIST = [{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}
              ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}
              ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}
              ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}
              ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}
              ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}
              ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}
              ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}];
var UCROW = {};

/* 
 * Creates a hash out of the current OKI Setup (OKILIST). 
 * Every time the user selects something, the hash is updated.
 */
function MECHASH() {
  // split the hash into parts
  var h = window.location.hash.substr(1).split("/"); // window.location.hash is everything after the base URL (from "#" onward)
  // if the array has at least one item, and the character code is valid, then set the character
  if (h.length >= 1 && CHARS[0].indexOf(h[0].toUpperCase()) != -1) HASHCHAR = h[0];
  // continue checking and setting values from the hash...
  if (h.length >= 2 && !isNaN(h[1]) && h[1] != "") HASHKD = +(h[1].trim())+1; // why +1? ***
  if (h.length >= 3 && !isNaN(h[2]) && h[2] != "") HASHKDBR = +(h[2].trim())+1;
  if (h.length >= 4 && !isNaN(h[3]) && h[3] != "") HASHKDR = +(h[3].trim())+1;

  if (h.length >= 5 && !isNaN(h[4]) && h[4] != "" && h[4].indexOf(",") == -1) {
    for (var i=1;i<=2;i++) {
      OKILIST[i].FRAMEKILL = +(h[4].trim())+1;
      if (h.length >= 6 && !isNaN(h[5]) && h[5] != "") OKILIST[i].STARTUP = +(h[5].trim());
      if (h.length >= 7 && !isNaN(h[6]) && h[6] != "") OKILIST[i].ACTIVE = +(h[6].trim());
      if (h.length >= 8 && !isNaN(h[7]) && h[7] != "") OKILIST[i].RECOVERY = +(h[7].trim());
      OKILIST[i].MOVE = "";
    }
  } else { 
  // if there's no hash, make one with the default values (the vars from the beginning)
    for (var i=1;i<=7;i++) {
      if (h.length >= i+4) {
        var hh = h[i+3].split(",");
        if (hh.length >= 1 && !isNaN(hh[0]) && hh[0] != "") OKILIST[i].FRAMEKILL = +(hh[0].trim());
        if (hh.length >= 2 && !isNaN(hh[1]) && hh[1] != "") OKILIST[i].STARTUP = +(hh[1].trim());
        // if (hh.length >= 3 && !isNaN(hh[2]) && hh[2] != "") OKILIST[i].ACTIVE = +(hh[2].trim());
        if (hh.length >= 3 && hh[2] != "") {
          OKILIST[i].MECACTIVE = hh[2].trim();
          if (!isNaN(OKILIST[i].MECACTIVE) && OKILIST[i].MECACTIVE != "") {
            OKILIST[i].ACTIVE = +OKILIST[i].MECACTIVE;
            OKILIST[i].UCACTIVE = "";
          } else { 
            OKILIST[i].ACTIVE = OKILIST[i].MECACTIVE.split(/[()]/)
            .map(function(x){return parseInt(x)||0;})
            .reduce(function(a,b){return a+b});

            OKILIST[i].UCACTIVE = OKILIST[i].MECACTIVE.split(/[()]/)
            .map(function(x,i){return parseInt(x)||0;})
            .reduce(function(a,b,i){return (i==1?Array(1+a).join("A"):a)+Array(1+b).join((i%2)==0?"A":"r")});
          }
        }
        if (hh.length >= 4 && !isNaN(hh[3]) && hh[3] != "") OKILIST[i].RECOVERY = +(hh[3].trim());
        if (hh.length >= 5 && hh[4] != "") OKILIST[i].MOVE = (hh[4].trim().replace(/\+/g," ").replace(/[^A-Za-z0-9 -]/g,"").trim()); else OKILIST[i].MOVE = "";
      }
    }
  }

}

/*
 * Hashes current selections and OKI Setup. (Make save-data)
 */
function UCHASH() {

  var h = "#" + (HASHCHAR) + "/" + (+HASHKD-1) + "/" + (+HASHKDBR-1) + "/" + (+HASHKDR-1) + "/"
        //+ "/" + (FRAMEKILL-1) + "/" + HASHSTARTUP + "/" + HASHACTIVE + "/" + HASHRECOVERY
        ;

  for (var i=1;i<=7;i++) {
    // h += OKILIST[i].FRAMEKILL + "," + OKILIST[i].STARTUP + "," + OKILIST[i].ACTIVE + "," + OKILIST[i].RECOVERY + "," + OKILIST[i].MOVE.trim().replace(/\s+/g,"+") + "/";
    h += OKILIST[i].FRAMEKILL + "," + OKILIST[i].STARTUP + "," + OKILIST[i].MECACTIVE + "," + OKILIST[i].RECOVERY + "," + OKILIST[i].MOVE.trim().replace(/\s+/g,"+") + "/";
  }

  // Update the url to show the correct hash.
  if (h != window.location.hash) { window.location.hash = h; }
}


/* Reddit stuff */
var REDDITEMBED1 = '<div class="reddit-embed" data-embed-media="www.redditmedia.com" data-embed-parent="false" data-embed-live="true" data-embed-created=""><a href="';
var REDDITEMBED2 = '">U CLICK CHAR U C REDDIT</a></div>';

var REDDITEMBEDCHAR = [];
REDDITEMBEDCHAR["ALX"] = REDDITEMBED1 + 'https://www.reddit.com/r/SFV_ALEX/comments/4kcmav/sfv_alex_oki_lol/d3dx5xx' + REDDITEMBED2;
REDDITEMBEDCHAR["BLR"] = REDDITEMBED1 + 'https://www.reddit.com/r/StreetFighterTech/comments/4ggj50/sfv_vega/d3dxbfc' + REDDITEMBED2;
REDDITEMBEDCHAR["BRD"] = REDDITEMBED1 + 'https://www.reddit.com/r/StreetFighterTech/comments/4ggirj/sfv_birdie/d3efskm' + REDDITEMBED2;
REDDITEMBEDCHAR["CMY"] = REDDITEMBED1 + 'https://www.reddit.com/r/StreetFighterTech/comments/4ggis5/sfv_cammy/d3dxc3b' + REDDITEMBED2;
REDDITEMBEDCHAR["ED"] = REDDITEMBED1 + 'https://www.reddit.com/r/SFV_ED/comments/6ao61o/sfv_ed_oki_lol/dhg2v5o/' + REDDITEMBED2;
REDDITEMBEDCHAR["FAN"] = REDDITEMBED1 + 'https://www.reddit.com/r/StreetFighterTech/comments/4ggiul/sfv_fang/d3dxc8q' + REDDITEMBED2;
REDDITEMBEDCHAR["GUL"] = REDDITEMBED1 + 'https://www.reddit.com/r/SFV_GUILE/comments/4kceto/sfv_guile_oki_lol/d3dvqky' + REDDITEMBED2;
REDDITEMBEDCHAR["KEN"] = REDDITEMBED1 + 'https://www.reddit.com/r/StreetFighterTech/comments/4ggivy/sfv_ken/d3dxcfr' + REDDITEMBED2;
REDDITEMBEDCHAR["KLN"] = REDDITEMBED1 + 'https://www.reddit.com/r/SFV_KOLIN/comments/5wm2gp/sfv_kolin_oki_lol/deb5l4i' + REDDITEMBED2;
REDDITEMBEDCHAR["KRN"] = REDDITEMBED1 + 'https://www.reddit.com/r/SFV_KARIN/comments/4kcmou/sfv_karin_oki_lol/d3dx8n1' + REDDITEMBED2;
REDDITEMBEDCHAR["LAR"] = REDDITEMBED1 + 'https://www.reddit.com/r/StreetFighterTech/comments/4ggiwo/sfv_laura/d3dxckx' + REDDITEMBED2;
REDDITEMBEDCHAR["NCL"] = REDDITEMBED1 + 'https://www.reddit.com/r/StreetFighterTech/comments/4ggj2w/sfv_necalli/d3dxcp3' + REDDITEMBED2;
REDDITEMBEDCHAR["RSD"] = REDDITEMBED1 + 'https://www.reddit.com/r/StreetFighterTech/comments/4ggj49/sfv_rashid/d3dxcw4' + REDDITEMBED2;
REDDITEMBEDCHAR["RYU"] = REDDITEMBED1 + 'https://www.reddit.com/r/StreetFighterTech/comments/4ggj4n/sfv_ryu/d3ba8uo' + REDDITEMBED2;
REDDITEMBEDCHAR["VEG"] = REDDITEMBED1 + 'https://www.reddit.com/r/StreetFighterTech/comments/4ggj1k/sfv_m_bison/d3dxd5l' + REDDITEMBED2;
REDDITEMBEDCHAR["ZGF"] = REDDITEMBED1 + 'https://www.reddit.com/r/StreetFighterTech/comments/4ggj5j/sfv_zangief/d3dxe7v' + REDDITEMBED2;
REDDITEMBEDCHAR["CNL"] = REDDITEMBED1 + 'https://www.reddit.com/r/StreetFighterTech/comments/4ggitb/sfv_chunli/d3ha6vc' + REDDITEMBED2;
REDDITEMBEDCHAR["DSM"] = REDDITEMBED1 + 'https://www.reddit.com/r/StreetFighterTech/comments/4ggitz/sfv_dhalsim/d3ha7hb' + REDDITEMBED2;
REDDITEMBEDCHAR["NSH"] = REDDITEMBED1 + 'https://www.reddit.com/r/StreetFighterTech/comments/4ggj2e/sfv_nash/d3ha7xy' + REDDITEMBED2;
REDDITEMBEDCHAR["RMK"] = REDDITEMBED1 + 'https://www.reddit.com/r/StreetFighterTech/comments/4ggj3d/sfv_r_mika/d3ha7pv' + REDDITEMBED2;
REDDITEMBEDCHAR["BSN"] = REDDITEMBED1 + 'https://www.reddit.com/r/SFV_BALROG/comments/4qz8zu/sfv_balrog_oki_lol/d4x0z25' + REDDITEMBED2;
REDDITEMBEDCHAR["IBK"] = REDDITEMBED1 + 'https://www.reddit.com/r/SFV_IBUKI/comments/4rhbdf/sfv_ibuki_oki_lol/d513ztk' + REDDITEMBED2;
REDDITEMBEDCHAR["JRI"] = REDDITEMBED1 + 'https://www.reddit.com/r/SFV_JURI/comments/4utand/sfv_juri_oki_lol/d5snzco' + REDDITEMBED2;
REDDITEMBEDCHAR["URN"] = REDDITEMBED1 + 'https://www.reddit.com/r/SFV_URIEN/comments/54dgec/sfv_urien_oki_lol/d80wput' + REDDITEMBED2;
REDDITEMBEDCHAR["GOK"] = REDDITEMBED1 + 'https://www.reddit.com/r/SFV_AKUMA/comments/5jj12t/sfv_akuma_oki_lol/dbgiuxt' + REDDITEMBED2;


/* An array containing one array which contains the 3-letter codename of each character */
var CHARS = [
["ALX", "BLR", //"BLR2",
"BRD", //"BRD2", 
"BSN", "CMY", "CNL", //"CNL2"
"DSM", "ED",
"FAN", "GOK", "GUL", "IBK", "JRI", "KEN", "KLN",
// ],
// [
"KRN", "LAR", 
"NCL", //"NCL2", 
"NSH", "RMK", 
"RSD", "RYU", //"RYU2", 
"URN", "VEG", //"VEG2",
"ZGF",
"RESET OKI","FRAME KILL","HELP","VIEW TOTAL TOP","STICK OKI"
]
];

// Show the Character Buttons
  var CDIV = d3.select("#CHARS");                         // Select one element in the DOM which has an id of "CHARS" (selects the section containing buttons)
  CDIV.selectAll().data(CHARS).enter().append("div")      // Create an empty group/selection within #CHARS, bind the CHARS array as the selection's data, and create a <div> in the group
      .attr("class", "ROW")                               // Set the class of the <div> element to "ROW"
      .selectAll().data(function(d){return d;}).enter().append("button") // Create an empty group, bind the data to the group, create buttons for each datum in the data
      .attr("class", function(d){ return "CHAR CHAR"+d;}) // Set the buttons' class names to "CHAR CHAR"+[Character Code]
      .on("click",function(d,i){
        if (d == "HELP") {
          //var win = window.open("https://twitter.com/TOOLASSlSTED/status/731544334781300736", '_blank');
          //win.focus();
          d3.select("#YUNOC").node().scrollIntoView();
          return;
        } else if (d == "VIEW TOTAL TOP") {
          var t1 = d3.selectAll("#TUT")[0][0];
          var t2 = d3.selectAll("#TOTALS")[0][0];
          var t3 = d3.selectAll("#OKIOKI")[0][0];
          var t4 = d3.selectAll("#FRAMES")[0][0];
          var t5 = d3.selectAll("#KD")[0][0];
          var t0 = t1.parentNode;
          t0.insertBefore(t2,t1);
          t0.insertBefore(t3,t1);
          t0.insertBefore(t4,t1);
          t0.insertBefore(t5,t1);
          return;
        } else if (d == "STICK OKI") {
          var stick = !d3.select("#OKIOKI").classed("STICK");
          d3.select("#OKIOKI").classed("STICK",stick);
          d3.select(this).classed("SEL",stick);
          return;
        } else if (d == "TOTAL2") {
          var t1 = d3.selectAll("#KILLS")[0][0];
          var t2 = d3.selectAll("#TOTALS")[0][0];
          var t0 = t1.parentNode;
          t0.insertBefore(t2,t1.nextSibling);
          return;
        } else if (d == "TOTAL3") {
          var t1 = d3.selectAll("#FRAMES")[0][0];
          var t2 = d3.selectAll("#TOTALS")[0][0];
          var t0 = t1.parentNode;
          t0.insertBefore(t2,t1.nextSibling);
          return;
        } else if (d == "TABLE") {
          var t1 = d3.selectAll(".TABLES")[0][0];
          var t2 = d3.selectAll(".TABLES")[0][1];
          var t0 = t1.parentNode;
          t0.insertBefore(t2,t1);
          return;
        } else if (d == "RESET OKI") {
          OKILIST = [{FRAMEKILL:1,STARTUP:0,ACTIVE:0,RECOVERY:0,MOVE:""}
                        ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}
                        ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}
                        ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}
                        ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}
                        ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}
                        ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}
                        ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}];

          MECOKI(7); UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
          MECOKI(6); UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
          MECOKI(5); UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
          MECOKI(4); UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
          MECOKI(3); UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
          MECOKI(2); UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
          MECOKI(1); UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
          UCHASH();
          return;
        } else if (d == "FRAME KILL") {

          TOTALSDIV.selectAll("*").remove();

          for (var total=1;total<70;total++) {
            TOTALSDIV.append("div").text("\nFRAME KILL " + total).classed("FRAMEKILL",true);
            UCTOTALROW("FRAME KILL " + total + " ",0,0,total);
          }

          TOTALSDIV.node().scrollIntoView();

          return;
        }

        var p = d3.select(this.parentNode.parentNode).datum();
        d3.selectAll(".CHAR").classed("SEL",false);
        d3.select(this).classed("SEL",true);
        
        HASHCHAR = d;
        d3.tsv(HASHCHAR+".txt", UCGILLEY);

          OKILIST = [{FRAMEKILL:1,STARTUP:0,ACTIVE:0,RECOVERY:0,MOVE:""}
                        ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}
                        ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}
                        ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}
                        ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}
                        ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}
                        ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}
                        ,{FRAMEKILL:1,STARTUP:0,MECACTIVE:"",UCACTIVE:"",ACTIVE:0,RECOVERY:0,MOVE:"",DATA:""}];

          MECOKI(7); UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
          MECOKI(6); UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
          MECOKI(5); UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
          MECOKI(4); UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
          MECOKI(3); UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
          MECOKI(2); UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
          MECOKI(1); UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
          UCHASH();

      })
      .text(function(d,i){return d;});

function UCTOP1() {
  var ADV = d3.select("#TOP1");
  var adv = ""
  for (var i=1;i<=119;i++) {
    adv += "<span class='UCLICK' onclick='UCOKI("+i+")'>" + (i%10) + "</span>";
  }
  ADV.html(adv);
}

function UCKD(kd, hash) {
  var ADV = d3.select("#ADVKD");
  var adv = ""
  for (var i=1;i<=119;i++) {
    var text = i<kd ? CHARPLUS : i>=kd+10 ? CHARMINUS : ((i-kd+1)%10);
    adv += "<span class='UCLICK" + (i<kd||i>=kd+10?"":" WAKEUP") + "' onclick='UCKD("+i+")'>" + text + "</span>";
  }
  adv += "<span class='ADVPLUS'> " + "+" + ((kd-1) + "     ").slice(0,3) + " U HIT " + (kd + "     ").slice(0,3) + " &middot; <span id='OKI12GAP'>0</span>F OKI1-OKI2</span>";
  ADV.html(adv);
  HASHKD = kd;
  if (hash == undefined) UCHASH();
  d3.select("#STYLEKD").text(".GRID > span:nth-child("+kd+") { text-decoration:underline; }");
  var OKI12GAP = OKILIST[2].FRAMEKILL - (OKILIST[1].FRAMEKILL + OKILIST[1].STARTUP + OKILIST[1].ACTIVE + OKILIST[1].RECOVERY-1);
  d3.select("#OKI12GAP").text(("     " + OKI12GAP).slice(-3));
}
function UCKDBR(kd, hash) {
  var ADV = d3.select("#ADVKDBR");
  var adv = ""
  for (var i=1;i<=119;i++) {
    var text = i<kd ? CHARPLUS : i>=kd+10 ? CHARMINUS : ((i-kd+1)%10);
    adv += "<span class='UCLICK" + (i<kd||i>=kd+10?"":" WAKEUP") + "' onclick='UCKDBR("+i+",false);UCKDR("+(i-5)+")'>" + text + "</span>";
  }
  adv += "<span class='ADVPLUS'> " + "+" + ((kd-1) + "     ").slice(0,3) + " U HIT " + (kd + "     ").slice(0,3) + " &middot; MOVE <span id='KDMOVE'></span></span>";
  ADV.html(adv);
  HASHKDBR = kd;
  if (hash == undefined) UCHASH();
  d3.select("#STYLEKDBR").text(".GRID > span:nth-child("+kd+") { text-decoration:underline; }");
}
function UCKDR(kd, hash) {
  var ADV = d3.select("#ADVKDR");
  var adv = ""
  for (var i=1;i<=119;i++) {
    var text = i<kd ? CHARPLUS : i>=kd+10 ? CHARMINUS : ((i-kd+1)%10);
    adv += "<span class='UCLICK" + (i<kd||i>=kd+10?"":" WAKEUP") + "' onclick='UCKDR("+i+",false);UCKDBR("+(i+5)+");'>" + text + "</span>";
  }
  adv += "<span class='ADVPLUS'> " + "+" + ((kd-1) + "     ").slice(0,3) + " U HIT " + (kd + "     ").slice(0,3) + " &middot;  CMD <span id='KDCMD'></span></span>";
  ADV.html(adv);  
  HASHKDR = kd;
  if (hash == undefined) UCHASH();
  d3.select("#STYLEKDR").text(".GRID > span:nth-child("+kd+") { text-decoration:underline; }");
}
function UCFK() {
  var ADV = d3.select("#FK");
  var adv = ""
  for (var i=1;i<=119;i++) {
    adv += "<span class='UCLICK' onclick='UCOKI("+i+")'>" + (i%10) + "</span>";
  }
  ADV.html(adv);
}
function UCOKI(kd, hash) {
  var active = OKILIST[MEOKI].ACTIVE;
  var recovery = OKILIST[MEOKI].RECOVERY;
  var startup = OKILIST[MEOKI].STARTUP-((active>0||(recovery>0&&active==0))?1:0);
  var move = OKILIST[MEOKI].MOVE;
  var data = OKILIST[MEOKI].DATA;
  var UCACTIVE = OKILIST[MEOKI].UCACTIVE; // console.log(UCACTIVE);
  var total = startup+active+recovery;
  if (total < 0) total = 0;

  if (kd>0) {
    FRAMEKILL = kd;
  } else {
    FRAMEKILL = OKILIST[MEOKI].FRAMEKILL;
  }


    var end = FRAMEKILL+startup+active+recovery-1;
    end = end > 119 ? 119 : end;
    //d3.selectAll(".UCY"+MEOKI).classed("UCY"+MEOKI, false);
    //for (var i=FRAMEKILL;i<=(end>119?119:end);i++) {
    //  d3.selectAll(".GRID > span:nth-child("+i+")").classed("UCY"+MEOKI, true);
    //}
    d3.select("#STYLEOKI"+MEOKI).text(".GRID > span:nth-child(n+"+FRAMEKILL+"):nth-child(-n+"+end+") { background-color:"+(MEOKI<3?"#022":"#330")+"; }");


  var fk = FRAMEKILL;
  OKILIST[MEOKI].FRAMEKILL = FRAMEKILL;

  var ADV = d3.select("#ADVOKI"+MEOKI);
  var adv = ""
  var text = "";
  var spanclass = "";
  var title = "";
  for (var i=1;i<=119;i++) {

    if (i<FRAMEKILL) {
      text = CHARPLUS;
      // text = (FRAMEKILL-i)%10;
      title = (FRAMEKILL-i)%10;
      spanclass = "";
    } else {
      if (i <= FRAMEKILL+startup-1) {
        text = "s";
        spanclass = "STARTUP";
      }
      else if (i <= FRAMEKILL+startup+active-1) {
        text = "A";
        spanclass = "ACTIVE";

        if (UCACTIVE != "") {
          // console.log(UCACTIVE,i,i-(FRAMEKILL+startup));
          text = UCACTIVE[i-(FRAMEKILL+startup)];
          if (text == "A") spanclass = "ACTIVE";
          else if (text == "r") spanclass = "RECOVERY";
        }
      }
      else if (i <= FRAMEKILL+startup+active+recovery-1) {
        text = "r";
        spanclass = "RECOVERY";
      } else {
        text = CHARMINUS;        
        spanclass = "";
        // if (active+recovery>0) {
        if (FRAMEKILL > 1 && startup+active+recovery==0) {
          text = (i-(FRAMEKILL+startup+active+recovery)+1)%10;
          if (text != "0") spanclass = "UCCOUNT";
          // if (text == "0") text = CHARMINUS;
          if (text == "0") text = (i-(FRAMEKILL+startup+active+recovery)+1)/10;
        }
      }
    }

    adv += "<span class='UCLICK " + spanclass + "' onclick='MECOKI("+MEOKI+");UCOKI("+i+")'>" + text + "</span>";
  }
  adv += "<span class='ADVPLUS' onclick='MECOKI("+MEOKI+")'> " + "+" + ((FRAMEKILL-1) + "     ").slice(0,3) + " U HIT " + ((FRAMEKILL + startup) + "     ").slice(0,3) + " &middot; " + ("     " + (total)).slice(-3) + "F " + move + "  <span class='MOVEDATA'>" + data + "</span></span>";
  ADV.html(adv);
  if (hash == undefined) UCHASH();

  if (MEOKI<=2) {
    var OKI12GAP = OKILIST[2].FRAMEKILL - (OKILIST[1].FRAMEKILL + OKILIST[1].STARTUP + OKILIST[1].ACTIVE + OKILIST[1].RECOVERY-1);
    d3.select("#OKI12GAP").text(("     " + OKI12GAP).slice(-3));
  }
}

function MECOKI(oki) {
  MEOKI = oki;
  d3.selectAll(".UCOKI").classed("UCOKI",false);
  d3.select("#ADVOKI"+oki).classed("UCOKI",true);
  d3.select(d3.select("#ADVOKI"+oki).node().previousElementSibling).classed("UCOKI",true);
}

function UCGILLEY(rows){

  var REDDIT = d3.select("#REDDIT");
  REDDIT.selectAll("*").remove();
  REDDIT.html(REDDITEMBEDCHAR[HASHCHAR]);
  UCREDDIT();

  var KD = d3.select("#KD");
  var FRAMES = d3.select("#FRAMES");
  var TOTALS = d3.select("#TOTALS");

  KD.selectAll("*").remove();
  FRAMES.selectAll("*").remove();
  TOTALS.selectAll("*").remove();

  var FRAMETABLE = FRAMES.append("div").append("table").classed("FRAMES",true);
  var KDTABLE = KD.append("div").append("table").classed("FRAMES",true);
  var TOTALSTABLE = TOTALS.append("div").append("table").classed("FRAMES",true);
  FRAMES.append("br");
  FRAMES.append("br");
  // TOTALS.append("br");

  var keys = d3.keys(rows[0]);
  function DATA_KDBR(d) { return d["KDRB Adv."] || d["HIT KDBR"] || d["CH KDBR"]; }
  function DATA_KDR(d) { return d["KDR Adv."] || d["HIT KDR"] || d["CH KDR"]; }
  function DATA_KD(d) { return d["KD Adv."] || d["HIT KD"] || d["CH KD"]; }
  function DATA_ADV_HIT(d) { return d["Hit Advantage"] || d["HIT ADV"]; }
  function DATA_ADV_BLK(d) { return d["Block Advantage"] || d["BLK ADV"]; }
  function DATA_STARTUP(d) { return d["Startup"] || d["START UP"] || ""; }
  function DATA_ACTIVE(d) { return d[" Active"] || d["ACTIVE"]; }
  function DATA_RECOVERY(d) { return d["Recovery"] || d["RECOVERY"]; }
  function DATA_TOTAL(d) { return d["Total"] || d["Total "]; }

  rows.forEach(function(r,i){r.row=i;});

  KDTABLE.append("thead").append("tr").selectAll("th").data(["KD ADV","KDR ADV","KDBR ADV"].concat(keys)).enter().append("th").text(function(d){return d;})
            .on("click",function(d,i){
              KDTABLE.selectAll("tbody tr").sort(function(a,b){
              if (d == "Move" || a[d] == null && b[d] == null) return a.row < b.row ? -1 : a.row > b.row ? 1 : 0;
              if (a[d] == null) return 1; 
              if (b[d] == null) return -1; 
              var ad = a[d] || "";
              var bd = b[d] || ""; 
              var adn = ad.trim().split(/[^0-9+-]/)[0];
              var bdn = bd.trim().split(/[^0-9+-]/)[0]; 
              if (isNaN(parseInt(adn)) && isNaN(parseInt(bdn))) return ad < bd ? 1 : ad > bd ? -1 : a.row < b.row ? -1 : a.row > b.row ? 1 : 0;
              if (isNaN(parseInt(adn))) return 1;
              if (isNaN(parseInt(bdn))) return -1;
              return +adn < +bdn ? 1 : +adn > +bdn ? -1 : a.row < b.row ? -1 : a.row > b.row ? 1 : 0;
            });});
  KDTABLE.append("tbody").selectAll("tr").data(rows.filter(function(d){return !isNaN(DATA_KD(d)) && DATA_KD(d) != "";})).enter().append("tr")
            .classed("UC",function(d){return +DATA_KDBR(d)==HASHKDBR-1 && +DATA_KDR(d)==HASHKDR-1 && +DATA_KD(d)==HASHKD-1; })
            .selectAll("td").data(function(d){ return [{key:"KD",value:"+"+DATA_KD(d)},{key:"KDR",value:"+"+DATA_KDR(d)},{key:"KDBR",value:"+"+DATA_KDBR(d)}].concat(d3.entries(d));})
            .enter().append("td").text(function(d){return d.value;})
            .on("click",function(d){
              var p = this.parentNode;
              var pd = d3.select(p).datum();
              KDMOVE = pd;
              KDTABLE.selectAll(".UC").classed("UC",false);
              d3.select(p).classed("UC",true);
              //UCOKI(0);
              UCKD(+DATA_KD(pd)+1);
              if (!isNaN(DATA_KDR(pd)) && DATA_KDR(pd) != "") {
                UCKDR(+DATA_KDR(pd)+1);
                if (!isNaN(DATA_KDBR(pd)) && DATA_KDBR(pd) != "") {
                  UCKDBR(+DATA_KDBR(pd)+1);
                } else {
                  UCKDBR(+DATA_KDR(pd)+1);
                }
              } else {
                UCKDR(+DATA_KD(pd)+1);
                UCKDBR(+DATA_KD(pd)+1);
              }
              UCHASH();
              d3.select("#KDMOVE").text(pd["Move"]);
              d3.select("#KDCMD").text(pd["Command"]);

            });

  FRAMETABLE.append("thead").append("tr").selectAll("th").data(["TOTAL"].concat(keys).concat([""])).enter().append("th").text(function(d){return d;})
            .on("click",function(d,i){
              FRAMETABLE.selectAll("tbody tr").sort(function(a,b){
              if (d == "Move" || a[d] == null && b[d] == null) return a.row < b.row ? -1 : a.row > b.row ? 1 : 0;
              if (a[d] == null) return 1; 
              if (b[d] == null) return -1; 
              var ad = a[d] || "";
              var bd = b[d] || ""; 
              var adn = ad.trim().split(/[^0-9+-]/)[0];
              var bdn = bd.trim().split(/[^0-9+-]/)[0]; 
              if (isNaN(parseInt(adn)) && isNaN(parseInt(bdn))) return ad < bd ? 1 : ad > bd ? -1 : a.row < b.row ? -1 : a.row > b.row ? 1 : 0;
              if (isNaN(parseInt(adn))) return 1;
              if (isNaN(parseInt(bdn))) return -1;
              return +adn < +bdn ? 1 : +adn > +bdn ? -1 : a.row < b.row ? -1 : a.row > b.row ? 1 : 0;
            });});
  FRAMETABLE.append("tbody").selectAll("tr").data(rows).enter().append("tr")
            // .classed("UC",function(d){return +DATA_STARTUP(d)==HASHSTARTUP && +d["Active"]==HASHACTIVE && +d["Recovery"]==HASHRECOVERY; })
            .selectAll("td").data(function(d){return [{key:"TOTAL",value:d["Total "] || d["Total"]}].concat(d3.entries(d)).concat([{key:"U C",value:"U C"}]);})
            .enter().append("td").text(function(d){ if (d.value == "dash forward") UCROW.DASH = this; return d.value;})
            .classed("UC",function(d){return d.key=="TOTAL" && FRAMEKILL>1 && +d.value==FRAMEKILL-1; })
            .on("click",function(d){
              var p = this.parentNode;
              var pd = d3.select(p).datum();
              

              if (d.key == "U C") {

                console.log(pd);

                FRAMETABLE.select("thead").insert("tr",":first-child")
                .selectAll("td").data( [{key:"TOTAL",value:pd["Total "] || pd["Total"]}].concat(d3.entries(pd)).concat([{key:"U NO C",value:"U NO C"}]) )
                .enter().append("td").text(function(dd){ console.log(dd); return dd.value;})
                .on("click",function(dd){
                  var pp = this.parentNode;
                  if (dd.key == "U NO C") {
                    d3.select(pp).remove();
                  }
                });

                return;
              }

              FRAMETABLE.selectAll(".UC").classed("UC",false);
              d3.select(p).classed("UC",true);              
              
              OKIMOVE = pd;
              if (OKIMOVE != null) {
                if (!isNaN(OKIMOVE["Active"]) && OKIMOVE["Active"] != "") { HASHACTIVE = +OKIMOVE["Active"]; }  else { HASHACTIVE = 0; }
                if (!isNaN(DATA_STARTUP(OKIMOVE)) && DATA_STARTUP(OKIMOVE) != "") { HASHSTARTUP = +DATA_STARTUP(OKIMOVE); } else { HASHSTARTUP = 1; }
                if (!isNaN(OKIMOVE["Recovery"]) && OKIMOVE["Recovery"] != "") { HASHRECOVERY = +OKIMOVE["Recovery"]; } else { HASHRECOVERY = 0; }

                OKILIST[MEOKI].MECACTIVE = OKIMOVE["Active"].replace(/\<\d+\>/g,"");
                if (!isNaN(OKILIST[MEOKI].MECACTIVE) && OKILIST[MEOKI].MECACTIVE != "") {
                  OKILIST[MEOKI].ACTIVE = +(OKILIST[MEOKI].MECACTIVE);
                  OKILIST[MEOKI].UCACTIVE = "";
                } else { 
                  OKILIST[MEOKI].ACTIVE = OKILIST[MEOKI].MECACTIVE.split(/[()]/)
                  .map(function(x){return parseInt(x)||0;})
                  .reduce(function(a,b){return a+b});

                  OKILIST[MEOKI].UCACTIVE = OKILIST[MEOKI].MECACTIVE.split(/[()]/)
                  .map(function(x,i){return parseInt(x)||0;})
                  .reduce(function(a,b,i){return (i==1?Array(1+a).join("A"):a)+Array(1+b).join((i%2)==0?"A":"r")});  
                }
                if (!isNaN(DATA_STARTUP(OKIMOVE)) && DATA_STARTUP(OKIMOVE) != "") { OKILIST[MEOKI].STARTUP = +DATA_STARTUP(OKIMOVE); } else { OKILIST[MEOKI].STARTUP = 1; }
                if (!isNaN(OKIMOVE["Recovery"]) && OKIMOVE["Recovery"] != "") { OKILIST[MEOKI].RECOVERY = +OKIMOVE["Recovery"]; } else { OKILIST[MEOKI].RECOVERY = 0; }

                OKILIST[MEOKI].MOVE = OKIMOVE["Move"];
                OKILIST[MEOKI].DATA = "" + DATA_ADV_HIT(OKIMOVE) + "/" + DATA_ADV_BLK(OKIMOVE);

              }
              UCOKI(0);
            });


  var totalrows = rows.filter(function(d){ var t=d["Total "]||d["Total"]; return !isNaN(t) && t != "";});

  TOTALROWS = totalrows
                  .sort(function(a,b){
                    var ta=+(a["Total "]||a["Total"]);
                    var tb=+(b["Total "]||b["Total"]);
                    if (ta > tb) return -1;
                    if (ta < tb) return  1;
                    return 0;
                  });

  totalrows.forEach(function(r,i){r.trow=i;})
  TOTALSTABLE.append("thead").append("tr").selectAll("th").data(["TOTAL"].concat(keys)).enter().append("th").text(function(d){return d;})
            .on("click",function(d,i){
              TOTALSTABLE.selectAll("tbody tr").sort(function(a,b){
              if (d == "Move" || a[d] == null && b[d] == null) return a.trow < b.trow ? -1 : a.trow > b.trow ? 1 : 0;
              if (a[d] == null) return 1; 
              if (b[d] == null) return -1; 
              var ad = a[d] || "";
              var bd = b[d] || ""; 
              var adn = ad.trim().split(/[^0-9+-]/)[0];
              var bdn = bd.trim().split(/[^0-9+-]/)[0]; 
              if (isNaN(parseInt(adn)) && isNaN(parseInt(bdn))) return ad < bd ? 1 : ad > bd ? -1 : a.trow < b.trow ? -1 : a.trow > b.trow ? 1 : 0;
              if (isNaN(parseInt(adn))) return 1;
              if (isNaN(parseInt(bdn))) return -1;
              return +adn < +bdn ? 1 : +adn > +bdn ? -1 : a.trow < b.trow ? -1 : a.trow > b.trow ? 1 : 0;
            });});  
  TOTALSTABLE.append("tbody").selectAll("tr").data(totalrows).enter().append("tr")            
            .selectAll("td").data(function(d){ return [{key:"TOTAL",value:d["Total "] || d["Total"]}].concat(d3.entries(d));})
            .enter().append("td").text(function(d){return d.value;})
            .on("click",function(d){
              var p = this.parentNode;
              var pd = d3.select(p).datum();
              

              if (d.key == "U C") {

                console.log(pd);

                TOTALSTABLE.select("thead").insert("tr",":first-child")
                .selectAll("td").data( [{key:"TOTAL",value:pd["Total "] || pd["Total"]}].concat(d3.entries(pd)).concat([{key:"U NO C",value:"U NO C"}]) )
                .enter().append("td").text(function(dd){ console.log(dd); return dd.value;})
                .on("click",function(dd){
                  var pp = this.parentNode;
                  if (dd.key == "U NO C") {
                    d3.select(pp).remove();
                  }
                });

                return;
              }

              TOTALSTABLE.selectAll(".UC").classed("UC",false);
              d3.select(p).classed("UC",true);              
              
              OKIMOVE = pd;
              if (OKIMOVE != null) {

                OKILIST[MEOKI].MECACTIVE = OKIMOVE["Active"].replace(/\<\d+\>/g,"");
                if (!isNaN(OKILIST[MEOKI].MECACTIVE) && OKILIST[MEOKI].MECACTIVE != "") {
                  OKILIST[MEOKI].ACTIVE = +OKILIST[MEOKI].MECACTIVE;
                  OKILIST[MEOKI].UCACTIVE = "";
                } else { 
                  OKILIST[MEOKI].ACTIVE = OKILIST[MEOKI].MECACTIVE.split(/[()]/)
                  .map(function(x){return parseInt(x)||0;})
                  .reduce(function(a,b){return a+b});

                  OKILIST[MEOKI].UCACTIVE = OKILIST[MEOKI].MECACTIVE.split(/[()]/)
                  .map(function(x,i){return parseInt(x)||0;})
                  .reduce(function(a,b,i){return (i==1?Array(1+a).join("A"):a)+Array(1+b).join((i%2)==0?"A":"r")});
                }
                if (!isNaN(DATA_STARTUP(OKIMOVE)) && DATA_STARTUP(OKIMOVE) != "") { OKILIST[MEOKI].STARTUP = +DATA_STARTUP(OKIMOVE); } else { OKILIST[MEOKI].STARTUP = 1; }
                if (!isNaN(OKIMOVE["Recovery"]) && OKIMOVE["Recovery"] != "") { OKILIST[MEOKI].RECOVERY = +OKIMOVE["Recovery"]; } else { OKILIST[MEOKI].RECOVERY = 0; }

                OKILIST[MEOKI].MOVE = OKIMOVE["Move"];
                OKILIST[MEOKI].DATA = "" + DATA_ADV_HIT(OKIMOVE) + "/" + DATA_ADV_BLK(OKIMOVE);

              }
              UCOKI(0);
            });            

  TOTALSDIV.selectAll("*").remove();

}

var TOTALSDIV = d3.select("#FRAMEKILLS");
var TOTALROWS = [];

function UCTOTALROW(pre,start,run,total) {
  TOTALROWS.forEach(function(row,i){
    if (i<start) return;
    var rowtotal = +(row["Total "]||row["Total"]);
    if (rowtotal+run>total) return;
    var loops = Math.floor((total-run)/rowtotal);
    if ((row["Command"]||"")=="HP+HK")loops = 1;
    if ((row["Command"]||"")=="5VT")loops = 1;
    for (var loop=loops;loop>=1;loop--) {
      if (rowtotal*loop+run==total) {
        TOTALSDIV.append("div").html(pre + (", " + rowtotal + "F " + row["Move"] +  " <span class='CMD'>" + row["Command"] + "</span>").repeat(loop));
      } else if (rowtotal*loop+run<total) {
        UCTOTALROW(pre + (", " + rowtotal + "F " + row["Move"] +  " <span class='CMD'>" + row["Command"] + "</span>").repeat(loop),i+1,rowtotal*loop+run,total);
      }
    }
  });
}


MECHASH();

UCTOP1();
UCKD(HASHKD, false);
UCKDBR(HASHKDBR, false);
UCKDR(HASHKDR, false);
MECOKI(1);
UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
MECOKI(2);
UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
MECOKI(3);
UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
MECOKI(4);
UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
MECOKI(5);
UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
MECOKI(6);
UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
MECOKI(7);
UCOKI(OKILIST[MEOKI].FRAMEKILL, false);
UCFK();
UCHASH();

d3.select("body").on("keydown", function() {
  switch(d3.event.keyCode) {
    case 0x61: case 0x31: MECOKI(1); break;
    case 0x62: case 0x32: MECOKI(2); break;
    case 0x63: case 0x33: MECOKI(3); break;
    case 0x64: case 0x34: MECOKI(4); break;
    case 0x65: case 0x35: MECOKI(5); break;
    case 0x66: case 0x36: MECOKI(6); break;
    case 0x67: case 0x37: MECOKI(7); break;
    case 46: 
      OKILIST[MEOKI].FRAMEKILL = 1;
      OKILIST[MEOKI].STARTUP = 0;
      OKILIST[MEOKI].MECACTIVE = "";
      OKILIST[MEOKI].UCACTIVE = "";
      OKILIST[MEOKI].ACTIVE = 0;
      OKILIST[MEOKI].RECOVERY = 0;
      OKILIST[MEOKI].MOVE = "";
      UCOKI(0);
      break;

    case 109: case 189:
      if (d3.event.ctrlKey) break;
      OKILIST[MEOKI].FRAMEKILL -= 1;
      UCOKI(0);
      break;

    case 107: case 187:
      if (d3.event.ctrlKey) break;
      OKILIST[MEOKI].FRAMEKILL += 1;
      UCOKI(0);
      break;


    case 68:
      if (UCROW.DASH) UCROW.DASH.click();
      break;
  } 
  // console.log(d3.event);
});



d3.tsv(HASHCHAR+".txt", UCGILLEY);
d3.selectAll(".CHAR"+HASHCHAR).classed("SEL",true);
