import ilustration from '@/assets/ilustrations/undraw_building_websites.svg';

const PageNotFound = () => {
    return ( <div className="flex flex-col gap-3 justify-center items-center h-full">

        <h1 className='font-bold text-xl'>Ops!</h1>
        <p>A página está em manutenção...</p>
        
        <img src={ilustration} className='w-96 my-8'/>
    </div> );
}
 
export default PageNotFound;