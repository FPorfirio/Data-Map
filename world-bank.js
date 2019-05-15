


function API_call() {

}


API_call.request =  function(url) {       
    return new Promise((resolve, reject) => {
        var req = new XMLHttpRequest;
        req.onload = function(){
            if(req.status == 200){
                resolve(JSON.parse(req.response));
            }
            else{
                reject(req.statusText);
            }
        }
        req.open('GET', url);
        req.send();
    })
}


const indicatorsID = `
    //World View

    Size of the economy
    Population, total (SP.POP.TOTL)
    Surface area (sq. km) (AG.SRF.TOTL.K2)
    Population density (people per sq. km of land area) (EN.POP.DNST)
    GNI, Atlas method (current US$) (NY.GNP.ATLS.CD)
    GNI per capita, Atlas method (current US$) (NY.GNP.PCAP.CD)
    GNI, PPP (current international $) (NY.GNP.MKTP.PP.CD)
    GNI per capita, PPP (current international $) (NY.GNP.PCAP.PP.CD)
    GDP growth (annual %) (NY.GDP.MKTP.KD.ZG)
    GDP per capita growth (annual %) (NY.GDP.PCAP.KD.ZG)

    WV.2Global goals: ending poverty and improving lives
    Income share held by lowest 20% (SI.DST.FRST.20)
    Prevalence of stunting, height for age (% of children under 5) (SH.STA.STNT.ZS)
    Maternal mortality ratio (modeled estimate, per 100,000 live births) (SH.STA.MMRT)
    Mortality rate, under-5 (per 1,000 live births) (SH.DYN.MORT)
    Incidence of HIV (% of uninfected population ages 15-49) (SH.HIV.INCD.ZS)
    Incidence of tuberculosis (per 100,000 people) (SH.TBS.INCD)
    Mortality caused by road traffic injury (per 100,000 people) (SH.STA.TRAF.P5)
    Primary completion rate, total (% of relevant age group) (SE.PRM.CMPT.ZS)
    Contributing family workers, male (% of male employment) (modeled ILO estimate) (SL.FAM.WORK.MA.ZS)
    Contributing family workers, female (% of female employment) (modeled ILO estimate) (SL.FAM.WORK.FE.ZS)
    GDP per person employed (constant 2011 PPP $) (SL.GDP.PCAP.EM.KD)

    WV.3Global goals: promoting sustainability
    People using safely managed drinking water services (% of population) (SH.H2O.SMDW.ZS)
    People using safely managed sanitation services (% of population) (SH.STA.SMSS.ZS)
    Access to electricity (% of population) (EG.ELC.ACCS.ZS)
    Renewable energy consumption (% of total final energy consumption) (EG.FEC.RNEW.ZS)
    Research and development expenditure (% of GDP) (GB.XPD.RSDV.GD.ZS)
    Population living in slums (% of urban population) (EN.POP.SLUM.UR.ZS)
    PM2.5 air pollution, mean annual exposure (micrograms per cubic meter) (EN.ATM.PM25.MC.M3)
    Adjusted net savings, including particulate emission damage (% of GNI) (NY.ADJ.SVNG.GN.ZS)
    CO2 emissions (metric tons per capita) (EN.ATM.CO2E.PC)
    Terrestrial and marine protected areas (% of total territorial area) (ER.PTD.TOTL.ZS)
    Intentional homicides (per 100,000 people) (VC.IHR.PSRC.P5)
    Individuals using the Internet (% of population) (IT.NET.USER.ZS)

    WV.5Women in development
    Life expectancy at birth, male (years) (SP.DYN.LE00.MA.IN)
    Life expectancy at birth, female (years) (SP.DYN.LE00.FE.IN)
    Women who were first married by age 18 (% of women ages 20-24) (SP.M18.2024.FE.ZS)
    Account ownership at a financial institution or with a mobile-money-service provider, male (% of population ages 15+) (FX.OWN.TOTL.MA.ZS)
    Account ownership at a financial institution or with a mobile-money-service provider, female (% of population ages 15+) (FX.OWN.TOTL.FE.ZS)
    Wage and salaried workers, male (% of male employment) (modeled ILO estimate) (SL.EMP.WORK.MA.ZS)
    Wage and salaried workers, female (% of female employment) (modeled ILO estimate) (SL.EMP.WORK.FE.ZS)
    Firms with female participation in ownership (% of firms) (IC.FRM.FEMO.ZS)
    Female share of employment in senior and middle management (%) (SL.EMP.SMGT.FE.ZS)
    Proportion of seats held by women in national parliaments (%) (SG.GEN.PARL.ZS)
    Nondiscrimination clause mentions gender in the constitution (1=yes; 0=no) (SG.NOD.CONS)


    //Poverty and Shared prosperity

    1.1Poverty rates at national poverty lines
    Poverty headcount ratio at national poverty lines (% of population) (SI.POV.NAHC)
    Rural poverty headcount ratio at national poverty lines (% of rural population) (SI.POV.RUHC)
    Urban poverty headcount ratio at national poverty lines (% of urban population) (SI.POV.URHC)
    Poverty gap at national poverty lines (%) (SI.POV.NAGP)
    Rural poverty gap at national poverty lines (%) (SI.POV.RUGP)
    Urban poverty gap at national poverty lines (%) (SI.POV.URGP)

    1.2Poverty rates at international poverty lines
    Poverty headcount ratio at $1.90 a day (2011 PPP) (% of population) (SI.POV.DDAY)
    Poverty headcount ratio at $3.20 a day (2011 PPP) (% of population) (SI.POV.LMIC)
    Poverty headcount ratio at $5.50 a day (2011 PPP) (% of population) (SI.POV.UMIC)

    1.3Distribution of income or consumption
    Gini index (World Bank estimate) (SI.POV.GINI)
    Income share held by lowest 10% (SI.DST.FRST.10)
    Income share held by lowest 20% (SI.DST.FRST.20)
    Income share held by second 20% (SI.DST.02ND.20)
    Income share held by third 20% (SI.DST.03RD.20)
    Income share held by fourth 20% (SI.DST.04TH.20)
    Income share held by highest 20% (SI.DST.05TH.20)
    Income share held by highest 10% (SI.DST.10TH.10)

    1.4Shared Prosperity
    Annualized average growth rate in per capita real survey mean consumption or income, bottom 40% of population (%) (SI.SPR.PC40.ZG)
    Annualized average growth rate in per capita real survey mean consumption or income, total population (%) (SI.SPR.PCAP.ZG)
    Survey mean consumption or income per capita, bottom 40% of population (2011 PPP $ per day) (SI.SPR.PC40)
    Survey mean consumption or income per capita, total population (2011 PPP $ per day) (SI.SPR.PCAP)


    //people

    2.1Population dynamics
    Population, total (SP.POP.TOTL),
    Population ages 0-14 (% of total) (SP.POP.0014.TO.ZS)
    Population ages 15-64 (% of total) (SP.POP.1564.TO.ZS)
    Population ages 65 and above (% of total) (SP.POP.65UP.TO.ZS)
    Age dependency ratio, young (% of working-age population) (SP.POP.DPND.YG)
    Age dependency ratio, old (% of working-age population) (SP.POP.DPND.OL)
    Death rate, crude (per 1,000 people) (SP.DYN.CDRT.IN)
    Birth rate, crude (per 1,000 people) (SP.DYN.CBRT.IN)
    
    2.2Labor force structure
    Labor force participation rate male (% of male population ages 15+) (modeled ILO estimate) (SL.TLF.CACT.MA.ZS)
    Labor force participation rate, female (% of female population ages 15+) (modeled ILO estimate) (SL.TLF.CACT.FE.ZS)
    Labor force, total (SL.TLF.TOTL.IN)
    Labor force, female (% of total labor force) (SL.TLF.TOTL.FE.ZS)

    2.3Employment by sector
    Employment in agriculture, male (% of male employment) (modeled ILO estimate) (SL.AGR.EMPL.MA.ZS),
    Employment in agriculture, female (% of female employment) (modeled ILO estimate) (SL.AGR.EMPL.FE.ZS),
    Employment in industry, male (% of male employment) (modeled ILO estimate) (SL.IND.EMPL.MA.ZS),
    Employment in industry, female (% of female employment) (modeled ILO estimate) (SL.IND.EMPL.FE.ZS),
    Employment in services, male (% of male employment) (modeled ILO estimate) (SL.SRV.EMPL.MA.ZS),
    Employment in services, female (% of female employment) (modeled ILO estimate) (SL.SRV.EMPL.FE.ZS),

    2.4Decent work and productive employment
    Employment to population ratio, 15+, total (%) (modeled ILO estimate) (SL.EMP.TOTL.SP.ZS),
    Employment to population ratio, ages 15-24, total (%) (modeled ILO estimate) (SL.EMP.1524.SP.ZS),
    Vulnerable employment, male (% of male employment) (modeled ILO estimate) (SL.EMP.VULN.MA.ZS),
    Vulnerable employment, female (% of female employment) (modeled ILO estimate) (SL.EMP.VULN.FE.ZS),
    GDP per person employed (constant 2011 PPP $) (SL.GDP.PCAP.EM.KD),

    2.5Unemployment
    Unemployment, male (% of male labor force) (modeled ILO estimate) (SL.UEM.TOTL.MA.ZS),
    Unemployment, female (% of female labor force) (modeled ILO estimate) (SL.UEM.TOTL.FE.ZS),
    Unemployment, youth male (% of male labor force ages 15-24) (modeled ILO estimate) (SL.UEM.1524.MA.ZS)
    Unemployment, youth female (% of female labor force ages 15-24) (modeled ILO estimate) (SL.UEM.1524.FE.ZS)
    Unemployment with basic education (% of total labor force with basic education) (SL.UEM.BASC.ZS)
    Unemployment with intermediate education (% of total labor force with intermediate education) (SL.UEM.INTM.ZS)
    Unemployment with intermediate education (% of total labor force with intermediate education) (SL.UEM.INTM.ZS)

    2.6Children at work
    Children in employment, total (% of children ages 7-14) (SL.TLF.0714.ZS)
    Children in employment, male (% of male children ages 7-14) (SL.TLF.0714.MA.ZS)
    Children in employment, female (% of female children ages 7-14) (SL.TLF.0714.FE.ZS)
    Children in employment, work only (% of children in employment, ages 7-14) (SL.TLF.0714.WK.ZS)
    Children in employment, study and work (% of children in employment, ages 7-14) (SL.TLF.0714.SW.ZS)
    Child employment in agriculture (% of economically active children ages 7-14) (SL.AGR.0714.ZS)
    Child employment in manufacturing (% of economically active children ages 7-14) (SL.MNF.0714.ZS)
    Child employment in services (% of economically active children ages 7-14) (SL.SRV.0714.ZS)
    Children in employment, self-employed (% of children in employment, ages 7-14) (SL.SLF.0714.ZS)
    Children in employment, wage workers (% of children in employment, ages 7-14) (SL.WAG.0714.ZS)
    Children in employment, unpaid family workers (% of children in employment, ages 7-14) (SL.FAM.0714.ZS)

    2.7Education inputs
    Government expenditure per student, primary (% of GDP per capita) (SE.XPD.PRIM.PC.ZS)
    Government expenditure per student, secondary (% of GDP per capita) (SE.XPD.SECO.PC.ZS)
    Government expenditure per student, tertiary (% of GDP per capita) (SE.XPD.TERT.PC.ZS)
    Government expenditure on education, total (% of GDP) (SE.XPD.TOTL.GD.ZS)
    Government expenditure on education, total (% of government expenditure) (SE.XPD.TOTL.GB.ZS)
    Trained teachers in primary education (% of total teachers) (SE.PRM.TCAQ.ZS)
    Trained teachers in secondary education (% of total teachers) (SE.SEC.TCAQ.ZS)
    Pupil-teacher ratio, primary (SE.PRM.ENRL.TC.ZS)
    Pupil-teacher ratio, secondary (SE.SEC.ENRL.TC.ZS)

    2.8Participation in education
    School enrollment, preprimary (% gross) (SE.PRE.ENRR)
    School enrollment, primary (% gross) (SE.PRM.ENRR)
    School enrollment, secondary (% gross) (SE.SEC.ENRR)
    School enrollment, tertiary (% gross) (SE.TER.ENRR)
    School enrollment, primary (% net) (SE.PRM.NENR)
    School enrollment, secondary (% net) (SE.SEC.NENR)
    Adjusted net enrollment rate, primary, male (% of primary school age children) (SE.PRM.TENR.MA)
    Adjusted net enrollment rate, primary, female (% of primary school age children) (SE.PRM.TENR.FE)
    Children out of school, primary, male (SE.PRM.UNER.MA)
    Children out of school, primary, female (SE.PRM.UNER.FE)

    2.9Education efficiency
    Gross intake ratio in first grade of primary education, male (% of relevant age group) (SE.PRM.GINT.MA.ZS)
    Gross intake ratio in first grade of primary education, female (% of relevant age group) (SE.PRM.GINT.FE.ZS)
    Persistence to grade 5, male (% of cohort) (SE.PRM.PRS5.MA.ZS)
    Persistence to grade 5, female (% of cohort) (SE.PRM.PRS5.FE.ZS)
    Persistence to last grade of primary, male (% of cohort) (SE.PRM.PRSL.MA.ZS)
    Persistence to last grade of primary, female (% of cohort) (SE.PRM.PRSL.FE.ZS)
    Repeaters, primary, male (% of male enrollment) (SE.PRM.REPT.MA.ZS)
    Repeaters, primary, female (% of female enrollment) (SE.PRM.REPT.FE.ZS)
    Progression to secondary school, male (%) (SE.SEC.PROG.MA.ZS)
    Progression to secondary school, female (%) (SE.SEC.PROG.FE.ZS)

    2.10Education completion and outcomes
    Primary completion rate, male (% of relevant age group) (SE.PRM.CMPT.MA.ZS)
    Primary completion rate, female (% of relevant age group) (SE.PRM.CMPT.FE.ZS)
    Lower secondary completion rate, male (% of relevant age group) (SE.SEC.CMPT.LO.MA.ZS)
    Lower secondary completion rate, female (% of relevant age group) (SE.SEC.CMPT.LO.FE.ZS)
    Literacy rate, youth male (% of males ages 15-24) (SE.ADT.1524.LT.MA.ZS)
    Literacy rate, youth female (% of females ages 15-24) (SE.ADT.1524.LT.FE.ZS)
    Literacy rate, adult male (% of males ages 15 and above) (SE.ADT.LITR.MA.ZS)
    Literacy rate, adult female (% of females ages 15 and above) (SE.ADT.LITR.FE.ZS)
    PISA: 15-year-olds by mathematics proficiency level (%). Below Level 1 (LO.PISA.MAT.0)
    PISA: 15-year-olds by reading proficiency level (%). Below Level 1B (LO.PISA.REA.0)
    PISA: 15-year-olds by science proficiency level (%). Below Level 1 (LO.PISA.SCI.0)

    2.11Education gaps by income, gender and area
    Primary completion rate, poorest quintile (% of relevant age group, DHS/MICS) (SE.PRM.CMPR.Q1.ZS)
    Primary completion rate, richest quintile (% of relevant age group, DHS/MICS) (SE.PRM.CMPR.Q5.ZS)
    Primary completion rate, male (% of relevant age group, DHS/MICS) (SE.PRM.CMPR.MA.ZS)
    Primary completion rate, female (% of relevant age group, DHS/MICS) (SE.PRM.CMPR.FE.ZS)
    Primary completion rate, urban (% of relevant age group, DHS/MICS) (SE.PRM.CMPR.UR.ZS)
    Primary completion rate, rural (% of relevant age group, DHS/MICS) (SE.PRM.CMPR.RU.ZS)
    Average years of schooling, poorest quintile (ages 15-19, DHS/MICS) (SE.YRS.SCHL.1519.Q1)
    Average years of schooling, richest quintile (ages 15-19, DHS/MICS) (SE.YRS.SCHL.1519.Q5)
    Children out of school, primary, poorest quintile (% of relevant age group, DHS/MICS) (SE.PRM.UNER.Q1.ZS)
    Children out of school, primary, richest quintile (% of relevant age group, DHS/MICS) (SE.PRM.UNER.Q5.ZS)

    2.12Health systems
    Current health expenditure (% of GDP) (SH.XPD.CHEX.GD.ZS)
    Domestic general government health expenditure (% of current health expenditure) (SH.XPD.GHED.CH.ZS)
    Out-of-pocket expenditure (% of current health expenditure) (SH.XPD.OOPC.CH.ZS)
    Current health expenditure per capita (current US$) (SH.XPD.CHEX.PC.CD)
    Current health expenditure per capita, PPP (current international $) (SH.XPD.CHEX.PP.CD)
    External health expenditure (% of current health expenditure) (SH.XPD.EHEX.CH.ZS)
    Physicians (per 1,000 people) (SH.MED.PHYS.ZS)
    Nurses and midwives (per 1,000 people) (SH.MED.NUMW.P3)
    Specialist surgical workforce (per 100,000 population) (SH.MED.SAOP.P5)
    Completeness of birth registration (%) (SP.REG.BRTH.ZS)
    Completeness of death registration with cause-of-death information (%) (SP.REG.DTHS.ZS)

    2.13Disease prevention coverage and quality
    People using safely managed drinking water services (% of population) (SH.H2O.SMDW.ZS)
    People using safely managed sanitation services (% of population) (SH.STA.SMSS.ZS)
    Immunization, measles (% of children ages 12-23 months) (SH.IMM.MEAS)
    Immunization, DPT (% of children ages 12-23 months) (SH.IMM.IDPT)
    ARI treatment (% of children under 5 taken to a health provider) (SH.STA.ARIC.ZS)
    Diarrhea treatment (% of children under 5 receiving oral rehydration and continued feeding) (SH.STA.ORCF.ZS)
    Use of insecticide-treated bed nets (% of under-5 population) (SH.MLR.NETS.ZS)
    Children with fever receiving antimalarial drugs (% of children under age 5 with fever) (SH.MLR.TRET.ZS)
    Tuberculosis treatment success rate (% of new cases) (SH.TBS.CURE.ZS)
    Tuberculosis case detection rate (%, all forms) (SH.TBS.DTEC.ZS)

    2.14Reproductive health
    Fertility rate, total (births per woman) (SP.DYN.TFRT.IN)
    Adolescent fertility rate (births per 1,000 women ages 15-19) (SP.ADO.TFRT)
    Demand for family planning satisfied by modern methods (% of married women with demand for family planning) (SH.FPL.SATM.ZS)
    Contraceptive prevalence, modern methods (% of women ages 15-49) (SP.DYN.CONM.ZS)
    Pregnant women receiving prenatal care (%) (SH.STA.ANVC.ZS)
    Births attended by skilled health staff (% of total) (SH.STA.BRTC.ZS)
    Maternal mortality ratio (national estimate, per 100,000 live births) (SH.STA.MMRT.NE)
    Maternal mortality ratio (modeled estimate, per 100,000 live births) (SH.STA.MMRT)
    Lifetime risk of maternal death (1 in: rate varies by country) (SH.MMR.RISK)

    2.15Nutrition and growth
    Prevalence of underweight, weight for age, male (% of children under 5) (SH.STA.MALN.MA.ZS)
    Prevalence of underweight, weight for age, female (% of children under 5) (SH.STA.MALN.FE.ZS)
    Prevalence of stunting, height for age, male (% of children under 5) (SH.STA.STNT.MA.ZS)
    Prevalence of stunting, height for age, female (% of children under 5) (SH.STA.STNT.FE.ZS)
    Prevalence of wasting, weight for height, male (% of children under 5) (SH.STA.WAST.MA.ZS)
    Prevalence of wasting, weight for height, female (% of children under 5) (SH.STA.WAST.FE.ZS)
    Prevalence of severe wasting, weight for height, male (% of children under 5) (SH.SVR.WAST.MA.ZS)
    Prevalence of severe wasting, weight for height, female (% of children under 5) (SH.SVR.WAST.FE.ZS)
    Prevalence of overweight, weight for height, male (% of children under 5) (SH.STA.OWGH.MA.ZS)
    Prevalence of overweight, weight for height, female (% of children under 5) (SH.STA.OWGH.FE.ZS)

    2.16Nutrition intake and supplements
    Low-birthweight babies (% of births) (SH.STA.BRTW.ZS)
    Exclusive breastfeeding (% of children under 6 months) (SH.STA.BFED.ZS)
    Consumption of iodized salt (% of households) (SN.ITK.SALT.ZS)
    Vitamin A supplementation coverage rate (% of children ages 6-59 months) (SN.ITK.VITA.ZS)
    Prevalence of anemia among children (% of children under 5) (SH.ANM.CHLD.ZS)
    Prevalence of anemia among pregnant women (%) (SH.PRG.ANEM)
    Prevalence of anemia among non-pregnant women (% of women ages 15-49) (SH.ANM.NPRG.ZS)

    2.17Health risk factors and future challenges
    Smoking prevalence, males (% of adults) (SH.PRV.SMOK.MA)
    Smoking prevalence, females (% of adults) (SH.PRV.SMOK.FE)
    Incidence of tuberculosis (per 100,000 people) (SH.TBS.INCD)
    Diabetes prevalence (% of population ages 20 to 79) (SH.STA.DIAB.ZS)
    Incidence of HIV (% of uninfected population ages 15-49) (SH.HIV.INCD.ZS)
    Prevalence of HIV, total (% of population ages 15-49) (SH.DYN.AIDS.ZS)
    Women's share of population ages 15+ living with HIV (%) (SH.DYN.AIDS.FE.ZS)
    Prevalence of HIV, male (% ages 15-24) (SH.HIV.1524.MA.ZS)
    Prevalence of HIV, female (% ages 15-24) (SH.HIV.1524.FE.ZS)
    Antiretroviral therapy coverage (% of people living with HIV) (SH.HIV.ARTC.ZS)
    Cause of death, by communicable diseases and maternal, prenatal and nutrition conditions (% of total) (SH.DTH.COMM.ZS)
    Cause of death, by non-communicable diseases (% of total) (SH.DTH.NCOM.ZS)
    Cause of death, by injury (% of total) (SH.DTH.INJR.ZS)

    2.18Mortality
    Life expectancy at birth, total (years) (SP.DYN.LE00.IN)
    Mortality rate, neonatal (per 1,000 live births) (SH.DYN.NMRT)
    Mortality rate, infant (per 1,000 live births) (SP.DYN.IMRT.IN)
    Mortality rate, under-5 (per 1,000 live births) (SH.DYN.MORT)
    Mortality rate, under-5, male (per 1,000 live births) (SH.DYN.MORT.MA)
    Mortality rate, under-5, female (per 1,000 live births) (SH.DYN.MORT.FE)
    Mortality rate, adult, male (per 1,000 male adults) (SP.DYN.AMRT.MA)
    Mortality rate, adult, female (per 1,000 female adults) (SP.DYN.AMRT.FE)

    2.19Health gaps by income: Demography
    Infant mortality rate (per 1,000 live births): Q1 (lowest) (SP.DYN.IMRT.Q1)
    Infant mortality rate (per 1,000 live births): Q5 (highest) (SP.DYN.IMRT.Q5)
    Under-5 mortality rate (per 1,000 live births): Q1 (lowest) (SH.DYN.MORT.Q1)
    Under-5 mortality rate (per 1,000 live births): Q5 (highest) (SH.DYN.MORT.Q5)
    Total fertility rate (TFR) (births per woman): Q1 (lowest) (SP.DYN.TFRT.Q1)
    Total fertility rate (TFR) (births per woman): Q5 (highest) (SP.DYN.TFRT.Q5)
    Teenage pregnancy and motherhood (% of women ages 15-19 who have had children or are currently pregnant): Q1 (lowest) (SP.MTR.1519.Q1.ZS)
    Teenage pregnancy and motherhood (% of women ages 15-19 who have had children or are currently pregnant): Q5 (highest) (SP.MTR.1519.Q5.ZS)

    2.19Health gaps by income: Child health
    Prevalence of diarrhea (% of children under 5): Q1 (lowest) (SH.STA.DIRH.Q1.ZS)
    Prevalence of diarrhea (% of children under 5): Q5 (highest) (SH.STA.DIRH.Q5.ZS)
    Treatment of diarrhea (ORS, RHS or increased fluids) (% of children under 5): Q1 (lowest) (SH.STA.ORHF.Q1.ZS)
    Treatment of diarrhea (ORS, RHS or increased fluids) (% of children under 5): Q5 (highest) (SH.STA.ORHF.Q5.ZS)
    Prevalence of acute respiratory infection (ARI) (% of children under 5): Q1 (lowest) (SH.STA.ARIF.Q1.ZS)
    Prevalence of acute respiratory infection (ARI) (% of children under 5): Q5 (highest) (SH.STA.ARIF.Q5.ZS)
    Treatment of acute respiratory infection (ARI) (% of children under 5 taken to a health provider): Q1 (lowest) (SH.STA.ARIC.Q1.ZS)
    Treatment of acute respiratory infection (ARI) (% of children under 5 taken to a health provider): Q5 (highest) (SH.STA.ARIC.Q5.ZS)
    Malnourished children (underweight, -2SD) (% of children under 5): Q1 (lowest) (SH.STA.MALN.Q1.ZS)
    Malnourished children (underweight, -2SD) (% of children under 5): Q5 (highest) (SH.STA.MALN.Q5.ZS)
    Vaccinations (all vaccinations) (% of children ages 12-23 months): Q1 (lowest) (SH.IMM.ALLV.Q1.ZS)
    Vaccinations (all vaccinations) (% of children ages 12-23 months): Q5 (highest) (SH.IMM.ALLV.Q5.ZS)

    2.19Health gaps by income: Reproductive and women's health
    Knowledge of contraception (any method) (% of married women): Q1 (lowest) (SH.FPL.KNOW.Q1.ZS)
    Knowledge of contraception (any method) (% of married women): Q5 (highest) (SH.FPL.KNOW.Q5.ZS)
    Current use of contraception (any method) (% of married women): Q1 (lowest) (SP.DYN.CONU.Q1.ZS)
    Current use of contraception (any method) (% of married women): Q5 (highest) (SP.DYN.CONU.Q5.ZS)
    Antenatal care (any skilled personnel) (% of women with a birth): Q1 (lowest) (SH.STA.ANVC.Q1.ZS)
    Antenatal care (any skilled personnel) (% of women with a birth): Q5 (highest) (SH.STA.ANVC.Q5.ZS)
    Assistance during delivery (any skilled personnel) (% of births): Q1 (lowest) (SH.STA.BRTC.Q1.ZS)
    Assistance during delivery (any skilled personnel) (% of births): Q5 (highest) (SH.STA.BRTC.Q5.ZS)
    Problems in accessing health care (any of the specified problems) (% of women): Q1 (lowest) (SH.ACS.PROB.Q1.ZS)
    Problems in accessing health care (any of the specified problems) (% of women): Q5 (highest) (SH.ACS.PROB.Q5.ZS)


    //Environment

    3.1Rural environment and land use
    Rural population (% of total population) (SP.RUR.TOTL.ZS)
    Rural population growth (annual %) (SP.RUR.TOTL.ZG)
    Land area (sq. km) (AG.LND.TOTL.K2)
    Forest area (% of land area) (AG.LND.FRST.ZS)
    Permanent cropland (% of land area) (AG.LND.CROP.ZS)
    Arable land (% of land area) (AG.LND.ARBL.ZS)
    Arable land (hectares per person) (AG.LND.ARBL.HA.PC)

    3.2Agricultural inputs
    Agricultural land (% of land area) (AG.LND.AGRI.ZS)
    Agricultural irrigated land (% of total agricultural land) (AG.LND.IRIG.AG.ZS)
    Average precipitation in depth (mm per year) (AG.LND.PRCP.MM)
    Land under cereal production (hectares) (AG.LND.CREL.HA)
    Fertilizer consumption (% of fertilizer production) (AG.CON.FERT.PT.ZS)
    Fertilizer consumption (kilograms per hectare of arable land) (AG.CON.FERT.ZS)
    Fertilizer consumption (kilograms per hectare of arable land) (AG.CON.FERT.ZS)
    Employment in agriculture (% of total employment) (modeled ILO estimate) (SL.AGR.EMPL.ZS)
    Agricultural machinery, tractors per 100 sq. km of arable land (AG.LND.TRAC.ZS)

    3.3Agricultural output and productivity
    Crop production index (2004-2006 = 100) (AG.PRD.CROP.XD)
    Food production index (2004-2006 = 100) (AG.PRD.FOOD.XD)
    Livestock production index (2004-2006 = 100) (AG.PRD.LVSK.XD)
    Cereal yield (kg per hectare) (AG.YLD.CREL.KG)
    Agriculture, value added per worker (constant 2010 US$) (NV.AGR.EMPL.KD)

    3.4Deforestation and biodiversity
    Forest area (sq. km) (AG.LND.FRST.K2)
    Mammal species, threatened (EN.MAM.THRD.NO)
    Bird species, threatened (EN.BIR.THRD.NO)
    Fish species, threatened (EN.FSH.THRD.NO)
    Plant species (higher), threatened (EN.HPT.THRD.NO)
    Terrestrial protected areas (% of total land area) (ER.LND.PTLD.ZS)
    Marine protected areas (% of territorial waters) (ER.MRN.PTMR.ZS)

    3.5Freshwater
    Renewable internal freshwater resources, total (billion cubic meters) (ER.H2O.INTR.K3)
    Renewable internal freshwater resources per capita (cubic meters) (ER.H2O.INTR.PC)
    Annual freshwater withdrawals, total (billion cubic meters) (ER.H2O.FWTL.K3)
    Annual freshwater withdrawals, total (% of internal resources) (ER.H2O.FWTL.ZS)
    Annual freshwater withdrawals, agriculture (% of total freshwater withdrawal) (ER.H2O.FWAG.ZS)
    Annual freshwater withdrawals, industry (% of total freshwater withdrawal) (ER.H2O.FWIN.ZS)
    Annual freshwater withdrawals, domestic (% of total freshwater withdrawal) (ER.H2O.FWDM.ZS)
    Water productivity, total (constant 2010 US$ GDP per cubic meter of total freshwater withdrawal) (ER.GDP.FWTL.M3.KD)
    People using at least basic drinking water services, urban (% of urban population) (SH.H2O.BASW.UR.ZS)
    People using at least basic drinking water services, rural (% of rural population) (SH.H2O.BASW.RU.ZS)

    3.7Electricity production, sources, and access
    Electricity production from coal sources (% of total) (EG.ELC.COAL.ZS)
    Electricity production from natural gas sources (% of total) (EG.ELC.NGAS.ZS)
    Electricity production from oil sources (% of total) (EG.ELC.PETR.ZS)
    Electricity production from hydroelectric sources (% of total) (EG.ELC.HYRO.ZS)
    Electricity production from renewable sources, excluding hydroelectric (% of total) (EG.ELC.RNWX.ZS)
    Electricity production from nuclear sources (% of total) (EG.ELC.NUCL.ZS)
    Access to electricity (% of population) (EG.ELC.ACCS.ZS)

    3.8Energy dependency, efficiency and carbon dioxide emissions
    Energy imports, net (% of energy use) (EG.IMP.CONS.ZS)
    GDP per unit of energy use (constant 2011 PPP $ per kg of oil equivalent) (EG.GDP.PUSE.KO.PP.KD)
    CO2 emissions (kt) (EN.ATM.CO2E.KT)
    CO2 intensity (kg per kg of oil equivalent energy use) (EN.ATM.CO2E.EG.ZS)
    CO2 emissions (metric tons per capita) (EN.ATM.CO2E.PC)
    CO2 emissions (kg per 2011 PPP $ of GDP) (EN.ATM.CO2E.PP.GD.KD)

    3.9Trends in greenhouse gas emissions
    Total greenhouse gas emissions (kt of CO2 equivalent) (EN.ATM.GHGT.KT.CE)
    Total greenhouse gas emissions (% change from 1990) (EN.ATM.GHGT.ZG)
    Methane emissions (kt of CO2 equivalent) (EN.ATM.METH.KT.CE)
    Methane emissions (% change from 1990) (EN.ATM.METH.ZG)
    Energy related methane emissions (% of total) (EN.ATM.METH.EG.ZS)
    Agricultural methane emissions (% of total) (EN.ATM.METH.AG.ZS)
    Nitrous oxide emissions (thousand metric tons of CO2 equivalent) (EN.ATM.NOXE.KT.CE)
    Nitrous oxide emissions (% change from 1990) (EN.ATM.NOXE.ZG)
    Nitrous oxide emissions in energy sector (% of total) (EN.ATM.NOXE.EG.ZS)
    Agricultural nitrous oxide emissions (% of total) (EN.ATM.NOXE.AG.ZS)
    Other greenhouse gas emissions, HFC, PFC and SF6 (thousand metric tons of CO2 equivalent) (EN.ATM.GHGO.KT.CE)
    Other greenhouse gas emissions (% change from 1990) (EN.ATM.GHGO.ZG)

    3.10Carbon dioxide emissions by sector
    CO2 emissions from electricity and heat production, total (% of total fuel combustion) (EN.CO2.ETOT.ZS)
    CO2 emissions from manufacturing industries and construction (% of total fuel combustion) (EN.CO2.MANF.ZS)
    CO2 emissions from residential buildings and commercial and public services (% of total fuel combustion) (EN.CO2.BLDG.ZS)
    CO2 emissions from transport (% of total fuel combustion) (EN.CO2.TRAN.ZS)
    CO2 emissions from other sectors, excluding residential buildings and commercial and public services (% of total fuel combustion) (EN.CO2.OTHX.ZS)

    3.11Climate variability, exposure to impact, and resilience
    Land area where elevation is below 5 meters (% of total land area) (AG.LND.EL5M.ZS)
    Population living in areas where elevation is below 5 meters (% of total population) (EN.POP.EL5M.ZS)
    Droughts, floods, extreme temperatures (% of population, average 1990-2009) (EN.CLC.MDAT.ZS)
    Urban land area where elevation is below 5 meters (% of total land area) (AG.LND.EL5M.UR.ZS)
    Rural population living in areas where elevation is below 5 meters (% of total population) (EN.POP.EL5M.RU.ZS)
    Rural land area where elevation is below 5 meters (% of total land area) (AG.LND.EL5M.RU.ZS)
    Urban population living in areas where elevation is below 5 meters (% of total population) (EN.POP.EL5M.UR.ZS)
    Disaster risk reduction progress score (1-5 scale; 5=best) (EN.CLC.DRSK.XQ)

    3.12Urbanization
    Urban population (SP.URB.TOTL)
    Urban population (% of total) (SP.URB.TOTL.IN.ZS)
    Urban population growth (annual %) (SP.URB.GROW)
    Population in urban agglomerations of more than 1 million (% of total population) (EN.URB.MCTY.TL.ZS)
    Population in the largest city (% of urban population) (EN.URB.LCTY.UR.ZS)
    People using at least basic sanitation services, urban (% of urban population) (SH.STA.BASS.UR.ZS)
    People using at least basic sanitation services, rural (% of rural population) (SH.STA.BASS.RU.ZS)

    3.13Sustainable energy for all
    Access to electricity (% of population) (EG.ELC.ACCS.ZS)
    Access to electricity, urban (% of urban population) (EG.ELC.ACCS.UR.ZS)
    Access to electricity, rural (% of rural population) (EG.ELC.ACCS.RU.ZS)
    Access to clean fuels and technologies for cooking (% of population) (EG.CFT.ACCS.ZS)
    Renewable energy consumption (% of total final energy consumption) (EG.FEC.RNEW.ZS)
    Renewable electricity output (% of total electricity output) (EG.ELC.RNEW.ZS)

    3.14Contribution of natural resources to gross domestic product
    Total natural resources rents (% of GDP) (NY.GDP.TOTL.RT.ZS)
    Oil rents (% of GDP) (NY.GDP.PETR.RT.ZS)
    Natural gas rents (% of GDP) (NY.GDP.NGAS.RT.ZS)
    Coal rents (% of GDP) (NY.GDP.COAL.RT.ZS)
    Mineral rents (% of GDP) (NY.GDP.MINR.RT.ZS)
    Forest rents (% of GDP) (NY.GDP.FRST.RT.ZS)


    //economy

    4.1Growth of output
    GDP (constant 2010 US$) (NY.GDP.MKTP.KD)
    Agriculture, value added (constant 2010 US$) (NV.AGR.TOTL.KD)
    Industry, value added (constant 2010 US$) (NV.IND.TOTL.KD)
    Manufacturing, value added (constant 2010 US$) (NV.IND.MANF.KD)
    Services, value added (constant 2010 US$) (NV.SRV.TOTL.KD)

    4.2Structure of output
    GDP (current US$) (NY.GDP.MKTP.CD)
    Agriculture, value added (% of GDP) (NV.AGR.TOTL.ZS)
    Industry, value added (% of GDP) (NV.IND.TOTL.ZS)
    Manufacturing, value added (% of GDP) (NV.IND.MANF.ZS)
    Services, value added (% of GDP) (NV.SRV.TOTL.ZS)

    4.3Structure of manufacturing
    Manufacturing, value added (current US$) (NV.IND.MANF.CD)
    Food, beverages and tobacco (% of value added in manufacturing) (NV.MNF.FBTO.ZS.UN)
    Textiles and clothing (% of value added in manufacturing) (NV.MNF.TXTL.ZS.UN)
    Machinery and transport equipment (% of value added in manufacturing) (NV.MNF.MTRN.ZS.UN)
    Chemicals (% of value added in manufacturing) (NV.MNF.CHEM.ZS.UN)
    Other manufacturing (% of value added in manufacturing) (NV.MNF.OTHR.ZS.UN)

    4.4Structure of merchandise exports
    Merchandise exports (current US$) (TX.VAL.MRCH.CD.WT)
    Food exports (% of merchandise exports) (TX.VAL.FOOD.ZS.UN)
    Agricultural raw materials exports (% of merchandise exports) (TX.VAL.AGRI.ZS.UN)
    Fuel exports (% of merchandise exports) (TX.VAL.FUEL.ZS.UN)
    Ores and metals exports (% of merchandise exports) (TX.VAL.MMTL.ZS.UN)
    Manufactures exports (% of merchandise exports) (TX.VAL.MANF.ZS.UN)

    4.5Structure of merchandise imports
    Merchandise imports (current US$) (TM.VAL.MRCH.CD.WT)
    Food imports (% of merchandise imports) (TM.VAL.FOOD.ZS.UN)
    Agricultural raw materials imports (% of merchandise imports) (TM.VAL.AGRI.ZS.UN)
    Fuel imports (% of merchandise imports) (TM.VAL.FUEL.ZS.UN)
    Ores and metals imports (% of merchandise imports) (TM.VAL.MMTL.ZS.UN)
    Manufactures imports (% of merchandise imports) (TM.VAL.MANF.ZS.UN)

    4.6Structure of service exports
    Commercial service exports (current US$) (TX.VAL.SERV.CD.WT)
    Transport services (% of commercial service exports) (TX.VAL.TRAN.ZS.WT)
    Travel services (% of commercial service exports) (TX.VAL.TRVL.ZS.WT)
    Insurance and financial services (% of commercial service exports) (TX.VAL.INSF.ZS.WT)
    Computer, communications and other services (% of commercial service exports) (TX.VAL.OTHR.ZS.WT)

    4.7Structure of service imports
    Commercial service imports (current US$) (TM.VAL.SERV.CD.WT)
    Transport services (% of commercial service imports) (TM.VAL.TRAN.ZS.WT)
    Travel services (% of commercial service imports) (TM.VAL.TRVL.ZS.WT)
    Insurance and financial services (% of commercial service imports) (TM.VAL.INSF.ZS.WT)
    Computer, communications and other services (% of commercial service imports) (TM.VAL.OTHR.ZS.WT)

    4.8Structure of demand
    Final consumption expenditure (% of GDP) (NE.CON.TOTL.ZS)
    General government final consumption expenditure (% of GDP) (NE.CON.GOVT.ZS)
    Households and NPISHs final consumption expenditure (% of GDP) (NE.CON.PRVT.ZS)
    Gross capital formation (% of GDP) (NE.GDI.TOTL.ZS)
    Exports of goods and services (% of GDP) (NE.EXP.GNFS.ZS)
    Imports of goods and services (% of GDP) (NE.IMP.GNFS.ZS)
    Gross savings (% of GDP) (NY.GNS.ICTR.ZS)

    4.9Growth of consumption, investment and trade
    Final consumption expenditure (constant 2010 US$) (NE.CON.TOTL.KD)
    General government final consumption expenditure (constant 2010 US$) (NE.CON.GOVT.KD)
    Household final consumption expenditure (constant 2010 US$) (NE.CON.PRVT.KD)
    Gross capital formation (constant 2010 US$) (NE.GDI.TOTL.KD)
    Exports of goods and services (constant 2010 US$) (NE.EXP.GNFS.KD)
    Imports of goods and services (constant 2010 US$) (NE.IMP.GNFS.KD)

    4.10Towards a broader measure of national income
    GDP (current US$) (NY.GDP.MKTP.CD)
    GDP (constant 2010 US$) (NY.GDP.MKTP.KD)
    GNI (current US$) (NY.GNP.MKTP.CD)
    GNI (constant 2010 US$) (NY.GNP.MKTP.KD)
    Adjusted savings: consumption of fixed capital (% of GNI) (NY.ADJ.DKAP.GN.ZS)
    Adjusted savings: natural resources depletion (% of GNI) (NY.ADJ.DRES.GN.ZS)
    Adjusted net national income (current US$) (NY.ADJ.NNTY.CD)
    Adjusted net national income (constant 2010 US$) (NY.ADJ.NNTY.KD)

    4.11Towards a broader measure of savings
    Adjusted savings: consumption of fixed capital (% of GNI) (NY.ADJ.DKAP.GN.ZS)
    Adjusted savings: education expenditure (% of GNI) (NY.ADJ.AEDU.GN.ZS)
    Adjusted savings: net forest depletion (% of GNI) (NY.ADJ.DFOR.GN.ZS)
    Adjusted savings: energy depletion (% of GNI) (NY.ADJ.DNGY.GN.ZS)
    Adjusted savings: mineral depletion (% of GNI) (NY.ADJ.DMIN.GN.ZS)
    Adjusted savings: carbon dioxide damage (% of GNI) (NY.ADJ.DCO2.GN.ZS)
    Adjusted savings: particulate emission damage (% of GNI) (NY.ADJ.DPEM.GN.ZS)
    Adjusted net savings, including particulate emission damage (% of GNI) (NY.ADJ.SVNG.GN.ZS)

    4.12Central government finances
    Expense (% of GDP) (GC.XPN.TOTL.GD.ZS)
    Net investment in nonfinancial assets (% of GDP) (GC.NFN.TOTL.GD.ZS)
    Net lending (+) / net borrowing (-) (% of GDP) (GC.NLD.TOTL.GD.ZS)
    Net acquisition of financial assets (% of GDP) (GC.AST.TOTL.GD.ZS)
    Net incurrence of liabilities, total (% of GDP) (GC.LBL.TOTL.GD.ZS)
    Central government debt, total (% of GDP) (GC.DOD.TOTL.GD.ZS)
    Interest payments (% of revenue) (GC.XPN.INTP.RV.ZS)

    4.13Central government expenditure
    Goods and services expense (% of expense) (GC.XPN.GSRV.ZS)
    Compensation of employees (% of expense) (GC.XPN.COMP.ZS)
    Interest payments (% of expense) (GC.XPN.INTP.ZS)
    Subsidies and other transfers (% of expense) (GC.XPN.TRFT.ZS)
    Other expense (% of expense) (GC.XPN.OTHR.ZS)

    4.14Central government revenues
    Taxes on income, profits and capital gains (% of revenue) (GC.TAX.YPKG.RV.ZS)
    Taxes on goods and services (% of revenue) (GC.TAX.GSRV.RV.ZS)
    Taxes on international trade (% of revenue) (GC.TAX.INTT.RV.ZS)
    Other taxes (% of revenue) (GC.TAX.OTHR.RV.ZS)
    Social contributions (% of revenue) (GC.REV.SOCL.ZS)
    Grants and other revenue (% of revenue) (GC.REV.GOTR.ZS)

    4.15Monetary indicators
    Broad money growth (annual %) (FM.LBL.BMNY.ZG)
    Claims on other sectors of the domestic economy (annual growth as % of broad money) (FM.AST.DOMO.ZG.M3)
    Claims on central government (annual growth as % of broad money) (FM.AST.CGOV.ZG.M3)
    Deposit interest rate (%) (FR.INR.DPST)
    Lending interest rate (%) (FR.INR.LEND)
    Real interest rate (%) (FR.INR.RINR)

    4.16Exchange rates and prices
    DEC alternative conversion factor (LCU per US$) (PA.NUS.ATLS)
    PPP conversion factor, GDP (LCU per international $) (PA.NUS.PPP)
    Price level ratio of PPP conversion factor (GDP) to market exchange rate (PA.NUS.PPPC.RF)
    Real effective exchange rate index (2010 = 100) (PX.REX.REER)
    GDP deflator (base year varies by country) (NY.GDP.DEFL.ZS)
    Consumer price index (2010 = 100) (FP.CPI.TOTL)

    4.17Balance of payments current account
    Exports of goods and services (BoP, current US$) (BX.GSR.GNFS.CD)
    Imports of goods and services (BoP, current US$) (BM.GSR.GNFS.CD)
    Net primary income (BoP, current US$) (BN.GSR.FCTY.CD)
    Net secondary income (BoP, current US$) (BN.TRF.CURR.CD)
    Current account balance (BoP, current US$) (BN.CAB.XOKA.CD)
    Total reserves (includes gold, current US$) (FI.RES.TOTL.CD)

    //states and markets

    5.1Private sector in the economy
    Investment in energy with private participation (current US$) (IE.PPI.ENGY.CD)
    Investment in transport with private participation (current US$) (IE.PPI.TRAN.CD)
    Investment in water and sanitation with private participation (current US$) (IE.PPI.WATR.CD)
    Investment in ICT with private participation (current US$) (IE.PPI.ICTI.CD)
    Domestic credit to private sector (% of GDP) (FS.AST.PRVT.GD.ZS)
    New businesses registered (number) (IC.BUS.NREG)
    New business density (new registrations per 1,000 people ages 15-64) (IC.BUS.NDNS.ZS)

    5.2Business environment: enterprise surveys
    Time spent dealing with the requirements of government regulations (% of senior management time) (IC.GOV.DURS.ZS)
    Number of visits or required meetings with tax officials (average for affected firms) (IC.TAX.METG)
    Time required to obtain an operating license (days) (IC.FRM.DURS)
    Bribery incidence (% of firms experiencing at least one bribe payment request) (IC.FRM.BRIB.ZS)
    Losses due to theft and vandalism (% of annual sales for affected firms) (IC.FRM.CRIM.ZS)
    Firms competing against unregistered firms (% of firms) (IC.FRM.CMPU.ZS)
    Firms with female top manager (% of firms) (IC.FRM.FEMM.ZS)
    Firms using banks to finance working capital (% of firms) (IC.FRM.BKWC.ZS)
    Value lost due to electrical outages (% of sales for affected firms) (IC.FRM.OUTG.ZS)
    Average time to clear exports through customs (days) (IC.CUS.DURS.EX)
    Firms offering formal training (% of firms) (IC.FRM.TRNG.ZS)

    5.3Business environment: Doing Business indicators
    Start-up procedures to register a business (number) (IC.REG.PROC)
    Time required to start a business (days) (IC.REG.DURS)
    Cost of business start-up procedures (% of GNI per capita) (IC.REG.COST.PC.ZS)
    Procedures to register property (number) (IC.PRP.PROC)
    Time required to register property (days) (IC.PRP.DURS)
    Procedures to build a warehouse (number) (IC.WRH.PROC)
    Time required to build a warehouse (days) (IC.WRH.DURS)
    Time required to get electricity (days) (IC.ELC.TIME)
    Time required to enforce a contract (days) (IC.LGL.DURS)
    Business extent of disclosure index (0=less disclosure to 10=more disclosure) (IC.BUS.DISC.XQ)
    Time to resolve insolvency (years) (IC.ISV.DURS)

    5.4Stock markets
    Market capitalization of listed domestic companies (current US$) (CM.MKT.LCAP.CD)
    Market capitalization of listed domestic companies (% of GDP) (CM.MKT.LCAP.GD.ZS)
    Stocks traded, total value (% of GDP) (CM.MKT.TRAD.GD.ZS)
    Stocks traded, turnover ratio of domestic shares (%) (CM.MKT.TRNR)
    Listed domestic companies, total (CM.MKT.LDOM.NO)
    S&P Global Equity Indices (annual % change) (CM.MKT.INDX.ZG)

    5.5Financial access, stability and efficiency
    Strength of legal rights index (0=weak to 12=strong) (IC.LGL.CRED.XQ)
    Depth of credit information index (0=low to 8=high) (IC.CRD.INFO.XQ)
    Depositors with commercial banks (per 1,000 adults) (FB.CBK.DPTR.P3)
    Borrowers from commercial banks (per 1,000 adults) (FB.CBK.BRWR.P3)
    Commercial bank branches (per 100,000 adults) (FB.CBK.BRCH.P5)
    Automated teller machines (ATMs) (per 100,000 adults) (FB.ATM.TOTL.P5)
    Bank capital to assets ratio (%) (FB.BNK.CAPA.ZS)
    Bank nonperforming loans to total gross loans (%) (FB.AST.NPER.ZS)
    Domestic credit to private sector by banks (% of GDP) (FD.AST.PRVT.GD.ZS)
    Interest rate spread (lending rate minus deposit rate, %) (FR.INR.LNDP)
    Risk premium on lending (lending rate minus treasury bill rate, %) (FR.INR.RISK)

    5.6Tax policies
    Tax revenue (% of GDP) (GC.TAX.TOTL.GD.ZS)
    Tax payments (number) (IC.TAX.PAYM)
    Time to prepare and pay taxes (hours) (IC.TAX.DURS)
    Profit tax (% of commercial profits) (IC.TAX.PRFT.CP.ZS)
    Labor tax and contributions (% of commercial profits) (IC.TAX.LABR.CP.ZS)
    Other taxes payable by businesses (% of commercial profits) (IC.TAX.OTHR.CP.ZS)
    Total tax rate (% of commercial profits) (IC.TAX.TOTL.CP.ZS)

    5.7Military expenditures and arms transfers
    Military expenditure (% of GDP) (MS.MIL.XPND.GD.ZS)
    Military expenditure (% of general government expenditure) (MS.MIL.XPND.ZS)
    Armed forces personnel, total (MS.MIL.TOTL.P1)
    Armed forces personnel (% of total labor force) (MS.MIL.TOTL.TF.ZS)
    Arms exports (SIPRI trend indicator values) (MS.MIL.XPRT.KD)
    Arms imports (SIPRI trend indicator values) (MS.MIL.MPRT.KD)

    5.8Fragile situations 
    IDA resource allocation index (1=low to 6=high) (IQ.CPA.IRAI.XQ)
    Presence of peace keepers (number of troops, police, and military observers in mandate) (VC.PKP.TOTL.UN)
    Battle-related deaths (number of people) (VC.BTL.DETH)
    Intentional homicides (per 100,000 people) (VC.IHR.PSRC.P5)
    Military expenditure (% of GDP) (MS.MIL.XPND.GD.ZS)
    Losses due to theft and vandalism (% of annual sales for affected firms) (IC.FRM.CRIM.ZS)
    Firms competing against unregistered firms (% of firms) (IC.FRM.CMPU.ZS)
    Children in employment, total (% of children ages 7-14) (SL.TLF.0714.ZS)
    Refugee population by country or territory of origin (SM.POP.REFG.OR)
    Refugee population by country or territory of asylum (SM.POP.REFG)
    Internally displaced persons, total displaced by conflict and violence (number of people) (VC.IDP.TOCV)
    Maternal mortality ratio (national estimate, per 100,000 live births) (SH.STA.MMRT.NE)
    Maternal mortality ratio (modeled estimate, per 100,000 live births) (SH.STA.MMRT)
    Mortality rate, under-5 (per 1,000 live births) (SH.DYN.MORT)
    People using safely managed drinking water services (% of population) (SH.H2O.SMDW.ZS)
    People using safely managed sanitation services (% of population) (SH.STA.SMSS.ZS)
    Depth of the food deficit (kilocalories per person per day) (SN.ITK.DFCT)
    School enrollment, primary (% gross) (SE.PRM.ENRR)

    5.9Public policies and institutions 
    IDA resource allocation index (1=low to 6=high) (IQ.CPA.IRAI.XQ)
    CPIA macroeconomic management rating (1=low to 6=high) (IQ.CPA.MACR.XQ)
    CPIA fiscal policy rating (1=low to 6=high) (IQ.CPA.FISP.XQ)
    CPIA debt policy rating (1=low to 6=high) (IQ.CPA.DEBT.XQ)
    CPIA economic management cluster average (1=low to 6=high) (IQ.CPA.ECON.XQ)
    CPIA trade rating (1=low to 6=high) (IQ.CPA.TRAD.XQ)
    CPIA financial sector rating (1=low to 6=high) (IQ.CPA.FINS.XQ)
    CPIA business regulatory environment rating (1=low to 6=high) (IQ.CPA.BREG.XQ)
    CPIA structural policies cluster average (1=low to 6=high) (IQ.CPA.STRC.XQ)
    CPIA gender equality rating (1=low to 6=high) (IQ.CPA.GNDR.XQ)
    CPIA equity of public resource use rating (1=low to 6=high) (IQ.CPA.PRES.XQ)
    CPIA building human resources rating (1=low to 6=high) (IQ.CPA.HRES.XQ)
    CPIA social protection rating (1=low to 6=high) (IQ.CPA.PROT.XQ)
    CPIA policy and institutions for environmental sustainability rating (1=low to 6=high) (IQ.CPA.ENVR.XQ)
    CPIA policies for social inclusion/equity cluster average (1=low to 6=high) (IQ.CPA.SOCI.XQ)
    CPIA property rights and rule-based governance rating (1=low to 6=high) (IQ.CPA.PROP.XQ)
    CPIA quality of budgetary and financial management rating (1=low to 6=high) (IQ.CPA.FINQ.XQ)
    CPIA efficiency of revenue mobilization rating (1=low to 6=high) (IQ.CPA.REVN.XQ)
    CPIA quality of public administration rating (1=low to 6=high) (IQ.CPA.PADM.XQ)
    CPIA transparency, accountability, and corruption in the public sector rating (1=low to 6=high) (IQ.CPA.TRAN.XQ)
    CPIA public sector management and institutions cluster average (1=low to 6=high) (IQ.CPA.PUBS.XQ)

    5.10Transport services
    Rail lines (total route-km) (IS.RRS.TOTL.KM)
    Railways, passengers carried (million passenger-km) (IS.RRS.PASG.KM)
    Railways, goods transported (million ton-km) (IS.RRS.GOOD.MT.K6)
    Container port traffic (TEU: 20 foot equivalent units) (IS.SHP.GOOD.TU)
    Air transport, registered carrier departures worldwide (IS.AIR.DPRT)
    Air transport, passengers carried (IS.AIR.PSGR)
    Air transport, freight (million ton-km) (IS.AIR.GOOD.MT.K1)

    5.11Power and communications
    Electric power consumption (kWh per capita) (EG.USE.ELEC.KH.PC)
    Electric power transmission and distribution losses (% of output) (EG.ELC.LOSS.ZS)
    Fixed telephone subscriptions (per 100 people) (IT.MLT.MAIN.P2)
    Mobile cellular subscriptions (per 100 people) (IT.CEL.SETS.P2)

    5.12The information society
    Individuals using the Internet (% of population) (IT.NET.USER.ZS)
    Secure Internet servers (per 1 million people) (IT.NET.SECR.P6)
    ICT goods exports (% of total goods exports) (TX.VAL.ICTG.ZS.UN)
    ICT goods imports (% total goods imports) (TM.VAL.ICTG.ZS.UN)
    ICT service exports (% of service exports, BoP) (BX.GSR.CCIS.ZS)

    5.13Science and technology
    Researchers in R&D (per million people) (SP.POP.SCIE.RD.P6)
    Technicians in R&D (per million people) (SP.POP.TECH.RD.P6)
    Scientific and technical journal articles (IP.JRN.ARTC.SC)
    Research and development expenditure (% of GDP) (GB.XPD.RSDV.GD.ZS)
    High-technology exports (current US$) (TX.VAL.TECH.CD)
    High-technology exports (% of manufactured exports) (TX.VAL.TECH.MF.ZS)
    Charges for the use of intellectual property, receipts (BoP, current US$) (BX.GSR.ROYL.CD)
    Charges for the use of intellectual property, payments (BoP, current US$) (BM.GSR.ROYL.CD)
    Patent applications, residents (IP.PAT.RESD)
    Patent applications, nonresidents (IP.PAT.NRES)
    Trademark applications, resident, by count (IP.TMK.RSCT)
    Trademark applications, nonresident, by count (IP.TMK.NRCT)
    Industrial design applications, resident, by count (IP.IDS.RSCT)
    Industrial design applications, nonresident, by count (IP.IDS.NRCT)

    5.14Statistical capacity
    Overall level of statistical capacity (scale 0 - 100) (IQ.SCI.OVRL)
    Methodology assessment of statistical capacity (scale 0 - 100) (IQ.SCI.MTHD)
    Source data assessment of statistical capacity (scale 0 - 100) (IQ.SCI.SRCE)
    Periodicity and timeliness assessment of statistical capacity (scale 0 - 100) (IQ.SCI.PRDC)


    //Global links

    6.1Growth of merchandise trade
    Export volume index (2000 = 100) (TX.QTY.MRCH.XD.WD)
    Import volume index (2000 = 100) (TM.QTY.MRCH.XD.WD)
    Export value index (2000 = 100) (TX.VAL.MRCH.XD.WD)
    Import value index (2000 = 100) (TM.VAL.MRCH.XD.WD)
    Net barter terms of trade index (2000 = 100) (TT.PRI.MRCH.XD.WD)

    6.4Direction of trade of low and middle income economies
    Merchandise exports to low- and middle-income economies within region (% of total merchandise exports) (TX.VAL.MRCH.WR.ZS)
    Merchandise exports to low- and middle-income economies outside region (% of total merchandise exports) (TX.VAL.MRCH.OR.ZS)
    Merchandise exports to high-income economies (% of total merchandise exports) (TX.VAL.MRCH.HI.ZS)
    Merchandise imports from low- and middle-income economies within region (% of total merchandise imports) (TM.VAL.MRCH.WR.ZS)
    Merchandise imports from low- and middle-income economies outside region (% of total merchandise imports) (TM.VAL.MRCH.OR.ZS)
    Merchandise imports from high-income economies (% of total merchandise imports) (TM.VAL.MRCH.HI.ZS)

    6.6Tariff barriers
    Binding coverage, all products (%) (TM.TAX.MRCH.BC.ZS)
    Bound rate, simple mean, all products (%) (TM.TAX.MRCH.BR.ZS)
    Tariff rate, applied, simple mean, all products (%) (TM.TAX.MRCH.SM.AR.ZS)
    Tariff rate, applied, weighted mean, all products (%) (TM.TAX.MRCH.WM.AR.ZS)
    Share of tariff lines with international peaks, all products (%) (TM.TAX.MRCH.IP.ZS)
    Share of tariff lines with specific rates, all products (%) (TM.TAX.MRCH.SR.ZS)
    Tariff rate, applied, simple mean, primary products (%) (TM.TAX.TCOM.SM.AR.ZS)
    Tariff rate, applied, weighted mean, primary products (%) (TM.TAX.TCOM.WM.AR.ZS)
    Tariff rate, applied, simple mean, manufactured products (%) (TM.TAX.MANF.SM.AR.ZS)
    Tariff rate, applied, weighted mean, manufactured products (%) (TM.TAX.MANF.WM.AR.ZS)

    6.7Trade facilitation
    Logistics performance index: Overall (1=low to 5=high) (LP.LPI.OVRL.XQ)
    Burden of customs procedure, WEF (1=extremely inefficient to 7=extremely efficient) (IQ.WEF.CUST.XQ)
    Lead time to export, median case (days) (LP.EXP.DURS.MD)
    Lead time to import, median case (days) (LP.IMP.DURS.MD)
    Cost to export, documentary compliance (US$) (IC.EXP.CSDC.CD)
    Cost to import, documentary compliance (US$) (IC.IMP.CSDC.CD)
    Liner shipping connectivity index (maximum value in 2004 = 100) (IS.SHP.GCNW.XQ)
    Quality of port infrastructure, WEF (1=extremely underdeveloped to 7=well developed and efficient by international standards) (IQ.WEF.PORT.XQ)

    6.8External debt
    External debt stocks, total (DOD, current US$) (DT.DOD.DECT.CD)
    External debt stocks (% of GNI) (DT.DOD.DECT.GN.ZS)
    External debt stocks, public and publicly guaranteed (PPG) (DOD, current US$) (DT.DOD.DPPG.CD)
    External debt stocks, private nonguaranteed (PNG) (DOD, current US$) (DT.DOD.DPNG.CD)
    External debt stocks, short-term (DOD, current US$) (DT.DOD.DSTC.CD)
    Short-term debt (% of total external debt) (DT.DOD.DSTC.ZS)
    Short-term debt (% of total reserves) (DT.DOD.DSTC.IR.ZS)
    Total debt service (% of exports of goods, services and primary income) (DT.TDS.DECT.EX.ZS)
    Present value of external debt (% of GNI) (DT.DOD.PVLX.GN.ZS)
    Present value of external debt (% of exports of goods, services and income) (DT.DOD.PVLX.EX.ZS)

    6.9Global Private Financial Flows
    Foreign direct investment, net inflows (BoP, current US$) (BX.KLT.DINV.CD.WD)
    Foreign direct investment, net inflows (% of GDP) (BX.KLT.DINV.WD.GD.ZS)
    Portfolio equity, net inflows (BoP, current US$) (BX.PEF.TOTL.CD.WD)
    Portfolio investment, bonds (PPG + PNG) (NFL, current US$) (DT.NFL.BOND.CD)
    Commercial banks and other lending (PPG + PNG) (NFL, current US$) (DT.NFL.PCBO.CD)

    6.10Net official financial flows
    Net financial flows, bilateral (NFL, current US$) (DT.NFL.BLAT.CD)
    Net financial flows, multilateral (NFL, current US$) (DT.NFL.MLAT.CD)
    Net financial flows, IDA (NFL, current US$) (DT.NFL.MIDA.CD)
    Net financial flows, IBRD (NFL, current US$) (DT.NFL.MIBR.CD)
    Net financial flows, IMF concessional (NFL, current US$) (DT.NFL.IMFC.CD)
    Net financial flows, IMF nonconcessional (NFL, current US$) (DT.NFL.IMFN.CD)
    Net financial flows, RDB concessional (NFL, current US$) (DT.NFL.RDBC.CD)
    Net financial flows, RDB nonconcessional (NFL, current US$) (DT.NFL.RDBN.CD)
    Net financial flows, others (NFL, current US$) (DT.NFL.MOTH.CD)

    6.11Aid dependency
    Net official development assistance received (current US$) (DT.ODA.ODAT.CD)
    Net ODA received per capita (current US$) (DT.ODA.ODAT.PC.ZS)
    Grants, excluding technical cooperation (BoP, current US$) (BX.GRT.EXTA.CD.WD)
    Technical cooperation grants (BoP, current US$) (BX.GRT.TECH.CD.WD)
    Net ODA received (% of GNI) (DT.ODA.ODAT.GN.ZS)
    Net ODA received (% of gross capital formation) (DT.ODA.ODAT.GI.ZS)
    Net ODA received (% of imports of goods, services and primary income) (DT.ODA.ODAT.MP.ZS)
    Net ODA received (% of central government expense) (DT.ODA.ODAT.XP.ZS)

    6.12Distribution of net aid by Development Assistance Committee members
    Net bilateral aid flows from DAC donors, United States (current US$) (DC.DAC.USAL.CD)
    Net bilateral aid flows from DAC donors, European Union institutions (current US$) (DC.DAC.CECL.CD)
    Net bilateral aid flows from DAC donors, United Kingdom (current US$) (DC.DAC.GBRL.CD)
    Net bilateral aid flows from DAC donors, Germany (current US$) (DC.DAC.DEUL.CD)
    Net bilateral aid flows from DAC donors, Japan (current US$) (DC.DAC.JPNL.CD)
    Net bilateral aid flows from DAC donors, France (current US$) (DC.DAC.FRAL.CD)
    Net bilateral aid flows from DAC donors, Norway (current US$) (DC.DAC.NORL.CD)
    Net bilateral aid flows from DAC donors, Australia (current US$) (DC.DAC.AUSL.CD)
    Net bilateral aid flows from DAC donors, Sweden (current US$) (DC.DAC.SWEL.CD)
    Net bilateral aid flows from DAC donors, Netherlands (current US$) (DC.DAC.NLDL.CD)

    6.13Movement of people across borders
    Net migration (SM.POP.NETM)
    International migrant stock, total (SM.POP.TOTL)
    Refugee population by country or territory of origin (SM.POP.REFG.OR)
    Refugee population by country or territory of asylum (SM.POP.REFG)
    Personal remittances, received (current US$) (BX.TRF.PWKR.CD.DT)
    Personal remittances, paid (current US$) (BM.TRF.PWKR.CD.DT)

    6.14Travel and tourism
    International tourism, number of arrivals (ST.INT.ARVL)
    International tourism, number of departures (ST.INT.DPRT)
    International tourism, receipts (current US$) (ST.INT.RCPT.CD)
    International tourism, receipts (% of total exports) (ST.INT.RCPT.XP.ZS)
    International tourism, expenditures (current US$) (ST.INT.XPND.CD)
    International tourism, expenditures (% of total imports) (ST.INT.XPND.MP.ZS)
`


const regexp1 = /\/[^\n]+\n{2}(?:[^\n]+\n{1,2})+/g; //match indicator group
const regexp2 = /\/[^\n]+/g; //match indicator group title
const regexp3 = /(([^\n])+\n{0,1})+/g //match indicator group subgroup
const regexp4 = /(?:[^\n])+/; //match indicator subgroup title 
const regexp5 = /([^\n])+\n{0,1}/g //match indicator subgroup lines;

const regexp6 = /^ + /gm //match spaces in the begin of lines
const regexp7 = / +$/gm //match spaces in the end of lines
const regexp8 = /\n/g //match lines feed

const regexp9 = /\/+/g // matches literall 

const regexp10 = /(?: +(?:[\d]|\D){1,4}\d)|^ +/g; //match worlds and letter at the begining of subgroup title

const regtry = /(?:[a-zA-Z]+ {0,1})+\n{0,1}/g


let myArr;

let bigAr = indicatorsID.match(regexp1);

let obj = (function(){
    const statics = []
    
    let indicatorGroups = indicatorsID.match(regexp1);
    indicatorGroups.forEach((group, index) => {
        const indicatorGroup = {}
        let groupTitle = group.match(regexp2)[0].replace(regexp9, "");
        indicatorGroup[groupTitle] = [];
        
        let groupSubgroups = group.match(regexp3);
        groupSubgroups.shift()
        groupSubgroups.forEach((item, index,ser) => {
            let subgroup = {};
            let subgroupTitle = item.match(regexp4);
            let subgroupContent = item.match(regexp5);
            subgroupTitle = subgroupTitle[0].replace(regexp10, "");
            subgroupContent.shift();
            subgroupContent.forEach((line, index) => {
               line = line.replace(regexp6, "")
               line = line.replace(regexp7, "")
               line = line.replace(regexp8, "")
                subgroupContent[index] = line
            })
            subgroup[subgroupTitle] = subgroupContent;
            indicatorGroup[groupTitle].push(subgroup);
            
        })
        statics.push(indicatorGroup);
    })
    return statics;
})()

export {obj, API_call}