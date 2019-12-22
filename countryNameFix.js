function fixCountryNames(string){
    let index = Object.keys(worldBankFix).indexOf(string)
    
    if(index == -1){
        return string
    }
    else{
        return worldBankFix[string]
    }
}

let worldBankFix = { 
    "Antigua and Barbuda": "Antigua and Barb.",
    "Bahamas, The": "Bahamas",
    "Bosnia and Herzegovina": "Bosnia and Herz.",
    "Brunei Darussalam": "Brunei",
    "Central African Republic": "Central African Rep.",
    "Cote d'Ivoire": "Côte d'Ivoire",
    "Congo, Dem. Rep.": "Dem. Rep. Congo",
    "Congo, Rep.": "Congo",
    "Cayman Islands": "Cayman Is.",
    "Czech Republic": "Czechia",
    "Dominican Republic": "Dominican Rep.",
    "Egypt, Arab Rep.": "Egypt",
    "Faroe Islands": "Faeroe Is.",
    "Micronesia, Fed. Sts.": "Micronesia",
    "Gambia, The": "Gambia",
    "Equatorial Guinea": "Eq. Guinea",
    "Hong Kong SAR, China": "Hong Kong",
    "Iran, Islamic Rep.": "Iran",
    "Kyrgyz Republic": "Kyrgyzstan",
    "Korea, Rep.": "South Korea",
    "Lao PDR": "Laos",
    "St. Lucia": "Saint Lucia",
    "Macao SAR, China": "Macao",
    "St. Martin (French part)": "St-Martin",
    "Marshall Islands": "Marshall Is.",
    "North Macedonia": "Macedonia",
    "Northern Mariana Islands": "N. Mariana Is.",
    "Korea, Dem. People’s Rep.": "North Korea",
    "West Bank and Gaza": "Palestine",
    "French Polynesia": "Fr. Polynesia",
    "Russian Federation": "Russia",
    "Solomon Islands": "Solomon Is.",
    "South Sudan": "S. Sudan",
    "Sao Tome and Principe": "São Tomé and Principe",
    "Slovak Republic": "Slovakia",
    "Eswatini": "eSwatini",
    "Syrian Arab Republic": "Syria",
    "Turks and Caicos Islands": "Turks and Caicos Is.",
    "United States": "United States of America",
    "St. Vincent and the Grenadines": "St. Vin. and Gren.",
    "Venezuela, RB": "Venezuela",
    "British Virgin Islands": "British Virgin Is.",
    "Virgin Islands (U.S.)": "U.S. Virgin Is.",
    "Yemen, Rep.": "Yemen"
}   

export {worldBankFix, fixCountryNames}