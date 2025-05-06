import React from 'react';

const OrderProxy: React.FC = () => {
    return (
        <div>
            <h1>Форма заказа прокси</h1>
            {/* Здесь добавьте вашу форму для заказа прокси */}
            <form>
                <label>
                    Количество прокси:
                    <input type="number" name="quantity" required />
                </label>
                <button type="submit">Заказать</button>
            </form>
        </div>
    );
};

export default OrderProxy; 