const dateConvert = (date)=>{
    let dateCurr  = date.split("-");
                dateCurr.reverse()
                let FinalDate = "";
                for(let i = 0;i<dateCurr.length;i++){
                         FinalDate+=dateCurr[i]
                         if(i!=2)FinalDate+="/";
                }
                return FinalDate;
}

module.exports = dateConvert;