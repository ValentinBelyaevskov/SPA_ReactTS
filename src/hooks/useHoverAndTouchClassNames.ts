import { useEffect, useState } from "react"




export const useHoverAndTouchClassNames = (hoverClassName: string, touchClassName: string) => {
   const [hoverClassNameValue, setHoverClassNameValue] = useState<string>(hoverClassName);
   const [touchClassNameValue, setTouchClassNameValue] = useState<string>("");
   const [touchHappened, setTouchHappened] = useState<boolean>(false);
   const [className, setClassName] = useState<string>(`${hoverClassNameValue} ${touchClassNameValue}`);

   // Хук выполняет следующие задачи:
   // 1) При первом наведении на элемент ему присваивается класс hover
   // 2) При каждом касании элемента ему присваивается класс touch,
   // и затем снова сбрасывается, что бы элемент был готов
   // и к событию наведения и к событию касания
   // 3) При первом касании после события 

// Разобраться с touchHappened. Почему false устанавливается в clickListener.

   // ! 1)
   // * При "первом" касании элемента (когда перед касанием этого элемента были касания до дргуих) происходит
   // * событие mouseEnter (после touchEnd).
   // * touchEnd устанавливает touchHappened = false спустя время, что бы эффект "2)" обнулил hoverClassNameValue


   const clickListener = () => {
      console.log("clickListener");
      setTouchHappened(false);
   }

   const mouseEnterListener = () => {
      // Событие срабатывает при первом touchstart после клика по элементу
      console.log("mouseEnterListener");
      if (hoverClassNameValue.length === 0) {
         setHoverClassNameValue(hoverClassName);
      }
   }

   const touchStartListener = () => {
      console.log("touchStartListener");
      setHoverClassNameValue("");
      setTouchClassNameValue(touchClassName);
   }

   const touchEndListener = () => {
      console.log("touchEndListener");
      setTouchClassNameValue("");
   }

   const resetHoverClassName = () => setHoverClassNameValue("");




   useEffect(() => {
      setClassName(`${hoverClassNameValue} ${touchClassNameValue}`);
   }, [touchClassNameValue, hoverClassNameValue])


   useEffect(() => {
      if (touchClassNameValue) {
         setTouchHappened(true);
      }
   }, [touchClassNameValue])


   useEffect(() => {
      // ! 2)
      // При первом touchStart после mouseEnter, touchHappened === true. И когда mouseEnter после первого touchStart
      // вызывается повторно, выполняется условие if. И при первом касании результат
      // лишнего срабатывания ховера обнуляется.
      if (touchHappened && hoverClassNameValue !== "") {
         setHoverClassNameValue("");
         setTouchHappened(false);
      }
   }, [touchHappened, hoverClassNameValue])


   // После окончания касания touchHappened всегда false.


   return {
      className,
      clickListener,
      mouseEnterListener,
      touchStartListener,
      touchEndListener,
      resetHoverClassName,
   }
}