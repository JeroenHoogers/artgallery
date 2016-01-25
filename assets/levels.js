// function getlevel(levelname)
// {
// 	levels = [
// 		"level1" : {"gallery":{"closed":true,"points":[184,130,854,130,1077,263,1077,453,854,576,184,576],"type":0},"holes":[{"closed":true,"points":[967,263,854,263,854,453,965,447],"type":0},{"closed":true,"points":[670,263,350,263,350,329,670,329],"type":0},{"closed":true,"points":[350,378,670,378,670,453,350,453],"type":0},{"closed":true,"points":[334,175,356,203,277,257,255,231],"type":0},{"closed":true,"points":[260,448,344,519,324,544,236,475],"type":0},{"closed":true,"points":[754,396,775,396,775,534,754,534,699,534,699,495,754,495],"type":0}],"obstacles":[],"covers":[],"paintings":[],"player":{"x":1024,"y":356},"guards":[{"position":{"x":0,"y":0},"guardpath":{"closed":true,"points":[],"type":0}},{"position":{"x":216,"y":157},"guardpath":{"closed":true,"points":[216,157,388,158,390,233,309,267,308,445,386,503,326,562,210,555],"type":0}},{"position":{"x":211,"y":543},"guardpath":{"closed":true,"points":[211,543,219,178,328,149,387,207,328,250,326,463,383,514,339,563],"type":0}},{"position":{"x":723,"y":350},"guardpath":{"closed":true,"points":[723,350,309,350,317,248,725,241,725,487,325,473,325,354],"type":0}}]}

// 	];
// 	return levels[levelname];
// }

var levels = new Array();
levels.push('{"target":5000,"gallery":{"closed":true,"points":[76,83,854,83,1136,257,1136,448,854,643,76,643],"type":0},"start":{"closed":true,"points":[975,98,1060,147,1029,192,943,139],"type":0},"finish":{"closed":true,"points":[135,643,260,643,260,705,135,705],"type":0},"target":5000,"holes":[{"closed":true,"points":[967,263,854,263,854,448,967,448],"type":0},{"closed":true,"points":[670,263,350,263,350,329,670,329],"type":0},{"closed":true,"points":[349,378,670,378,670,453,349,453],"type":0},{"closed":true,"points":[334,175,356,203,277,257,255,231],"type":0},{"closed":true,"points":[260,448,344,519,324,544,236,475],"type":0},{"closed":true,"points":[754,396,775,396,775,534,754,534,699,534,699,495,754,495],"type":0},{"closed":true,"points":[775,303,751,303,751,209,699,209,699,169,775,169],"type":0},{"closed":true,"points":[436,127,621,169,609,198,436,158],"type":0},{"closed":true,"points":[618,523,629,553,430,587,438,556],"type":0}],"obstacles":[{"closed":true,"points":[127,237,198,237,239,324,198,396,214,436,154,486,159,420,115,303],"type":0},{"closed":true,"points":[922,499,839,574,857,502],"type":0},{"closed":true,"points":[831,160,857,215,920,221],"type":0}],"covers":[],"paintings":[{"value":2000,"painting":{"x1":848,"y1":300,"x2":848,"y2":405}},{"value":1000,"painting":{"x1":447,"y1":260,"x2":598,"y2":260}},{"value":1000,"painting":{"x1":447,"y1":458,"x2":599,"y2":458}},{"value":500,"painting":{"x1":972,"y1":316,"x2":972,"y2":388}},{"value":500,"painting":{"x1":1131,"y1":320,"x2":1131,"y2":390}},{"value":500,"painting":{"x1":1050,"y1":500,"x2":974,"y2":553}},{"value":500,"painting":{"x1":529,"y1":638,"x2":426,"y2":638}},{"value":500,"painting":{"x1":396,"y1":89,"x2":490,"y2":89}},{"value":500,"painting":{"x1":81,"y1":301,"x2":81,"y2":404}}],"player":{"position":{"x":1000,"y":143}},"guards":[{"position":{"x":725,"y":346},"guardpath":{"closed":true,"points":[725,346,331,351,330,241,725,241,723,477,329,479,329,350,815,345,815,141,669,142,670,239,724,241,724,348,813,344,813,568,671,569,671,474,719,474],"type":0}}]}');
levels.push('{"target":5000,"gallery":{"closed":true,"points":[59,35,704,35,585,255,926,210,736,159,756,35,1213,35,1213,697,999,697,999,575,844,697,59,697],"type":0},"start":{"closed":true,"points":[9,545,9,615,59,615,59,545],"type":0},"finish":{"closed":true,"points":[1213,93,1213,175,1270,175,1270,93],"type":0},"target":5000,"holes":[{"closed":true,"points":[660,369,779,621,948,496,704,369,1115,369,1115,548,1155,548,1155,123,1115,123,1115,321,637,321,637,369],"type":0},{"closed":true,"points":[308,560,533,432,464,650],"type":0},{"closed":true,"points":[338,93,218,210,336,279,508,165],"type":0},{"closed":true,"points":[585,321,585,369,149,369,149,581,111,581,111,123,149,123,149,321],"type":0}],"obstacles":[{"closed":true,"points":[823,88,900,158,983,124],"type":0},{"closed":true,"points":[603,488,660,488,691,600,574,600],"type":0}],"covers":[],"paintings":[{"painting":{"x1":929,"y1":41,"x2":1038,"y2":41},"value":2000},{"painting":{"x1":1109,"y1":183,"x2":1109,"y2":278},"value":1000},{"painting":{"x1":830,"y1":228,"x2":718,"y2":243},"value":1000},{"painting":{"x1":648,"y1":130,"x2":607,"y2":204},"value":500},{"painting":{"x1":470,"y1":196,"x2":400,"y2":243},"value":500},{"painting":{"x1":155,"y1":190,"x2":155,"y2":270},"value":500},{"painting":{"x1":236,"y1":374,"x2":335,"y2":374},"value":500},{"painting":{"x1":408,"y1":374,"x2":493,"y2":374},"value":500},{"painting":{"x1":706,"y1":477,"x2":735,"y2":540},"value":500},{"painting":{"x1":955,"y1":374,"x2":1034,"y2":374},"value":1000}],"player":{"position":{"x":35,"y":581}},"guards":[{"position":{"x":631,"y":71},"guardpath":{"closed":true,"points":[631,71,259,55,219,145,162,72,82,77,86,645,324,626,192,523,440,405,615,408,611,289,1056,287,972,169,1093,223,515,289],"type":0}},{"position":{"x":791,"y":388},"guardpath":{"closed":true,"points":[791,388,1075,398,932,452,1084,585,1189,587,1187,70,783,57,774,138,935,183,1043,98,1187,70,1189,589,1082,583,1079,397,888,437],"type":0}}]}');
levels.push('{"target":5000,"gallery":{"closed":true,"points":[344,52,344,301,388,301,388,52,830,52,830,301,868,301,868,52,1221,52,1221,255,925,255,925,301,1221,301,1221,445,925,445,925,506,1221,506,1221,680,868,680,868,445,830,445,830,680,387,680,387,445,344,445,344,680,60,680,60,52],"type":0},"start":{"closed":true,"points":[15,577,15,648,60,648,60,577],"type":0},"finish":{"closed":true,"points":[1221,93,1221,169,1274,169,1274,93],"type":0},"target":5000,"holes":[{"closed":true,"points":[770,349,770,255,448,255,448,349,491,349,491,281,725,281,725,349],"type":0},{"closed":true,"points":[447,401,491,401,491,478,725,478,725,401,770,401,770,506,447,506],"type":0},{"closed":true,"points":[204,132,126,301,283,301],"type":0},{"closed":true,"points":[283,445,125,445,204,605],"type":0},{"closed":true,"points":[568,341,654,342,654,401,568,401],"type":0}],"obstacles":[{"closed":true,"points":[491,93,529,169,654,202,725,169],"type":0},{"closed":true,"points":[491,648,516,577,591,648],"type":0},{"closed":true,"points":[614,559,654,648,726,621,741,563],"type":0},{"closed":true,"points":[1107,558,953,648,1090,626],"type":0},{"closed":true,"points":[933,131,1006,172,1128,149,1036,129,1025,90],"type":0}],"covers":[],"paintings":[{"painting":{"x1":65,"y1":319,"x2":65,"y2":428},"value":1000},{"painting":{"x1":549,"y1":286,"x2":673,"y2":286},"value":1000},{"painting":{"x1":553,"y1":475,"x2":671,"y2":475},"value":1000},{"painting":{"x1":1215,"y1":329,"x2":1215,"y2":419},"value":2000},{"painting":{"x1":160,"y1":676,"x2":251,"y2":676},"value":500},{"painting":{"x1":255,"y1":58,"x2":162,"y2":58},"value":500},{"painting":{"x1":574,"y1":251,"x2":649,"y2":251},"value":500},{"painting":{"x1":574,"y1":512,"x2":649,"y2":512},"value":500},{"painting":{"x1":1012,"y1":513,"x2":1096,"y2":513},"value":500},{"painting":{"x1":1008,"y1":251,"x2":1095,"y2":251},"value":500}],"player":{"position":{"x":42,"y":610}},"guards":[{"position":{"x":521,"y":308},"guardpath":{"closed":true,"points":[521,308,696,311,694,450,514,449,519,320,698,311,697,452,514,452,518,307,697,314,697,376,798,378,902,336,1192,332,1192,421,926,424,796,379,690,377,694,449,518,450],"type":0}},{"position":{"x":1186,"y":80},"guardpath":{"closed":true,"points":[1186,80,1192,219,899,220,898,524,1203,516,1202,637,897,641,894,415,800,415,803,609,418,611,415,401,95,401,96,476,206,655,314,480,314,262,208,79,86,257,87,341,416,337,419,77,796,78,801,341,896,338,900,80],"type":0}}]}');
levels.push('{"target":5000,"gallery":{"closed":true,"points":[76,49,1182,49,1182,648,76,648],"type":0},"start":{"closed":true,"points":[15,545,15,615,76,615,76,545],"type":0},"finish":{"closed":true,"points":[1182,147,1182,234,1256,234,1256,147],"type":0},"target":5000,"holes":[{"closed":true,"points":[166,212,166,254,249,254,249,147,207,147,207,212],"type":0},{"closed":true,"points":[166,481,166,520,207,520,207,580,249,580,249,481],"type":0},{"closed":true,"points":[207,316,207,420,249,420,249,316],"type":0},{"closed":true,"points":[],"type":0},{"closed":true,"points":[311,212,311,254,852,254,852,212],"type":0},{"closed":true,"points":[465,316,465,420,506,420,506,316],"type":0},{"closed":true,"points":[311,481,311,520,852,520,852,481],"type":0},{"closed":true,"points":[651,316,651,420,694,420,694,316],"type":0},{"closed":true,"points":[908,119,955,119,955,563,908,563],"type":0},{"closed":true,"points":[1046,444,1004,563,1078,599,1132,541,1073,540],"type":0},{"closed":true,"points":[1079,86,1133,147,1079,147,1046,234,1004,119],"type":0}],"obstacles":[{"closed":true,"points":[328,347,374,388,416,400,418,339,381,352],"type":0},{"closed":true,"points":[566,329,548,420,607,395,606,316],"type":0},{"closed":true,"points":[769,340,734,394,786,408,859,391,837,314],"type":0},{"closed":true,"points":[361,167,361,112,821,112,821,167],"type":0},{"closed":true,"points":[361,561,361,615,821,615,821,561],"type":0}],"covers":[],"paintings":[{"painting":{"x1":530,"y1":259,"x2":623,"y2":259},"value":2000},{"painting":{"x1":527,"y1":477,"x2":618,"y2":477},"value":2000},{"painting":{"x1":459,"y1":342,"x2":459,"y2":400},"value":1000},{"painting":{"x1":698,"y1":342,"x2":698,"y2":399},"value":1000},{"painting":{"x1":902,"y1":314,"x2":902,"y2":408},"value":1000},{"painting":{"x1":201,"y1":342,"x2":201,"y2":398},"value":500},{"painting":{"x1":438,"y1":208,"x2":519,"y2":208},"value":500},{"painting":{"x1":657,"y1":207,"x2":748,"y2":207},"value":500},{"painting":{"x1":418,"y1":525,"x2":493,"y2":525},"value":500},{"painting":{"x1":635,"y1":525,"x2":736,"y2":525},"value":500},{"painting":{"x1":959,"y1":293,"x2":959,"y2":425},"value":500}],"player":{"position":{"x":44,"y":581}},"guards":[{"position":{"x":325,"y":188},"guardpath":{"closed":true,"points":[325,188,886,187,885,625,284,628,281,95,156,97,281,99,281,285,182,285,279,284,280,546,877,545,878,185,878,81,989,83,990,342,989,82,326,81],"type":0}},{"position":{"x":630,"y":290},"guardpath":{"closed":true,"points":[630,290,629,431,526,448,530,291,436,290,435,448,526,449,546,311,629,288,719,290,720,445,628,447,624,289,560,287,535,326],"type":0}}]}');
levels.push('{"target":10000,"gallery":{"closed":true,"points":[225,693,69,693,69,572,156,572,156,556,69,556,69,440,225,440,225,513,242,513,242,440,289,440,289,421,69,421,69,160,310,160,310,138,69,138,69,72,432,72,432,109,452,109,452,23,791,23,791,109,903,109,903,160,1149,160,1149,292,1071,292,1071,314,1149,314,1149,421,933,421,933,440,1149,440,1149,693,812,693,812,650,791,650,791,693,627,693,627,611,608,611,608,693,452,693,452,650,432,650,432,693,242,693,242,625,225,625],"type":0},"start":{"closed":true,"points":[69,72,69,125,30,125,30,72],"type":0},"finish":{"closed":true,"points":[791,23,791,88,844,88,844,23],"type":0},"target":10000,"holes":[{"closed":true,"points":[844,181,812,181,812,252,791,252,791,181,452,181,452,421,590,421,590,440,452,440,452,596,432,596,432,572,356,572,356,556,432,556,432,440,370,440,370,421,432,421,432,181,356,160,356,138,432,160,844,160],"type":0},{"closed":true,"points":[844,421,844,440,812,440,812,596,791,596,791,440,649,440,649,421,791,421,791,292,885,292,885,314,812,314,812,421],"type":0},{"closed":true,"points":[964,229,980,229,980,365,964,365],"type":0},{"closed":true,"points":[964,496,980,496,980,556,1046,556,1046,572,980,572,980,639,964,639,964,572,902,572,903,556,964,556],"type":0},{"closed":true,"points":[731,572,709,572,709,513,537,513,537,572,516,572,516,496,731,496],"type":0},{"closed":true,"points":[345,217,328,217,328,365,345,365],"type":0},{"closed":true,"points":[242,198,242,217,176,217,176,365,242,365,242,384,156,384,156,198],"type":0}],"obstacles":[{"closed":true,"points":[501,238,501,351,547,351,590,303],"type":0},{"closed":true,"points":[608,365,709,338,709,277,590,229,649,303],"type":0},{"closed":true,"points":[590,109,590,125,671,125,671,109],"type":0},{"closed":true,"points":[495,54,495,88,516,88,516,54],"type":0},{"closed":true,"points":[709,54,709,88,731,88,731,54],"type":0},{"closed":true,"points":[1068,475,1125,513,1125,586,1090,658,1105,542],"type":0},{"closed":true,"points":[128,616,168,610,195,650,156,671,114,650],"type":0}],"covers":[],"paintings":[{"painting":{"x1":550,"y1":187,"x2":725,"y2":187},"value":2000},{"painting":{"x1":957,"y1":253,"x2":957,"y2":330},"value":1000},{"painting":{"x1":659,"y1":492,"x2":586,"y2":492},"value":1000},{"painting":{"x1":426,"y1":247,"x2":426,"y2":339},"value":1000},{"painting":{"x1":227,"y1":222,"x2":194,"y2":222},"value":500},{"painting":{"x1":180,"y1":251,"x2":180,"y2":327},"value":500},{"painting":{"x1":191,"y1":362,"x2":226,"y2":362},"value":500},{"painting":{"x1":323,"y1":259,"x2":323,"y2":317},"value":500},{"painting":{"x1":247,"y1":456,"x2":247,"y2":496},"value":500},{"painting":{"x1":220,"y1":457,"x2":220,"y2":496},"value":500},{"painting":{"x1":95,"y1":551,"x2":135,"y2":551},"value":500},{"painting":{"x1":247,"y1":641,"x2":247,"y2":678},"value":500},{"painting":{"x1":375,"y1":577,"x2":415,"y2":577},"value":500},{"painting":{"x1":603,"y1":630,"x2":603,"y2":671},"value":500},{"painting":{"x1":596,"y1":518,"x2":648,"y2":518},"value":500},{"painting":{"x1":959,"y1":589,"x2":959,"y2":622},"value":500},{"painting":{"x1":985,"y1":589,"x2":985,"y2":622},"value":500},{"painting":{"x1":832,"y1":320,"x2":870,"y2":320},"value":500},{"painting":{"x1":1087,"y1":320,"x2":1129,"y2":320},"value":500}],"player":{"position":{"x":49,"y":95}},"guards":[{"position":{"x":138,"y":182},"guardpath":{"closed":true,"points":[138,182,265,184,265,250,194,249,194,345,267,345,267,406,388,407,390,187,339,188,341,105,451,142,691,142,690,53,549,55,547,139,446,142,330,105,330,186,279,187,279,404,136,403],"type":0}},{"position":{"x":109,"y":452},"guardpath":{"closed":true,"points":[109,452,205,465,205,533,271,533,270,462,404,464,404,531,332,531,332,628,488,627,489,468,628,468,628,391,755,391,758,201,474,201,476,398,624,395,626,468,488,470,489,628,331,630,329,594,204,596,203,532,100,533],"type":0}},{"position":{"x":1107,"y":184},"guardpath":{"closed":true,"points":[1107,184,1109,264,1028,263,1027,332,1110,335,1110,400,900,399,865,662,953,669,936,598,874,598,875,523,940,525,953,467,870,473,872,399,840,401,840,336,936,334,932,272,753,272,618,209,494,202,749,209,750,347,754,274,926,271,933,183],"type":0}}]}');