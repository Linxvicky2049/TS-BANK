export default function Status({text,success=false}:{text:string;success?:boolean}){return text?<div className={success?'status success':'status'}>{text}</div>:null}
