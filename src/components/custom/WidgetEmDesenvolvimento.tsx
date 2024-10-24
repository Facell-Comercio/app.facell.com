import ilustration from '@/assets/ilustrations/undraw_building_websites.svg';
import { DotsLoading } from './Loading';

export const WidgetEmDesenvolvimento = () => {
    return (
        <div className='w-full h-full p-10 flex flex-col items-center justify-center '>
            <div className='flex gap-3'>
                <span className="text-start text-2xl text-primary font-semibold text-nowrap">Em desenvolvimento <DotsLoading size={8} qtde={3}/></span>
                
            </div>
            <img src={ilustration} className='w-96 my-8' />
        </div>
    )
}