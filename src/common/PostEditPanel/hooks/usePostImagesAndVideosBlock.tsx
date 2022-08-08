import { compose } from "functions/compose";
import { useScrollOrWindowSize, WindowSize } from "hooks/useScrollOrWindowSize";
import { useEffect, useRef, useState } from "react";
import { isTheFileTypeIsCorrect } from "../functions/isTheFileTypeIsCorrect";



export type GridDirection = "vertical" | "horizontal"

export type ImagesAndVideosItem = {
   type: "image" | "video"
   src?: string,
   file?: File,
   aspect?: number,
   area?: number,
   sizes?: [number, number]
}

export type GridContainerStyle = {
   gridTemplateColumns?: string
   gridTemplateRows?: string
   width?: string
}

type GridTemplateFr = {
   gridTemplateColumns: string,
   jointAspect: number,
   sizes: number[]
}



export const usePostImagesAndVideosBlock = (resize: WindowSize) => {
   const [imagesAndVideos, setImagesAndVideos] = useState<ImagesAndVideosItem[]>([]);
   const [imagesAndVideosBlockStyle, setImagesAndVideosBlockStyle] = useState<{ marginTop?: string, maxHeight?: string }>({});
   const [gridDirection, setGridDirection] = useState<GridDirection>("horizontal");
   const [imagesAndVideosContainerStyle, setImagesAndVideosContainerStyle] = useState<GridContainerStyle>({});
   const [firstSubContainerStyle, setFirstSubContainerStyle] = useState<GridContainerStyle>({});
   const [secondSubContainerStyle, setSecondSubContainerStyle] = useState<GridContainerStyle>({});
   const [thirdSubContainerStyle, setThirdSubContainerStyle] = useState<GridContainerStyle>({});
   const panelRef = useRef<HTMLDivElement>(null);
   const [containerSizes, setContainerSizes] = useState<[number, number]>([510, 350]);
   const [containerAspect, setContainerAspect] = useState<number>(350 / 510);




   const addImageOrVideo = (file: File | null, callback: () => void, type: "image" | "video", sizes: [number, number] | undefined): void => {
      if (file) {
         if (!isTheFileTypeIsCorrect(file, type)) {
            callback();
            return;
         };

         const imageObj: ImagesAndVideosItem = {
            type,
            src: URL.createObjectURL(file),
            file: file,
            aspect: sizes ? (sizes[1] / sizes[0]) : 1,
            area: sizes ? sizes[1] * sizes[0] : 0,
            sizes
         }

         setImagesAndVideos([...imagesAndVideos, imageObj]);
      }

      callback();
   }

   const deleteImageOrVideo = (index: number): void => {
      setImagesAndVideos(imagesAndVideos.filter((item, i) => i !== index));
   }

   const getGridTemplateFr = (aspects: number[]): GridTemplateFr => {
      let n: number = aspects.length;
      let sizes: number[] = [];
      let jointAspect: number = 0;
      let jointSize: number = 0;

      if (n >= 2) {
         sizes[0] = aspects[1] / (aspects[0] + aspects[1]);
         sizes[1] = 1 - sizes[0];
         jointAspect = aspects[0] * aspects[1] / (aspects[0] + aspects[1]);

         if (n >= 3) {
            for (let m = 2; m < n; m++) {
               let sizesSum: number = 0;
               jointSize = aspects[m] / (jointAspect + aspects[m]);
               jointAspect = jointAspect * aspects[m] / (jointAspect + aspects[m]);
               sizes[m] = 1 - jointSize;

               for (let i = 0; i <= m - 2; i++) {
                  sizes[i] = sizes[i] * jointSize;
               }

               for (let i = 0; i <= m - 2; i++) {
                  sizesSum = sizesSum + sizes[i];
               }

               sizes[m - 1] = 1 - (sizesSum + sizes[m]);
            }
         }
      }

      return {
         gridTemplateColumns: sizes.map(item => `${item}fr`).join(" "),
         jointAspect,
         sizes
      };
   }


   const getGridTemplatePerPx = (sizes_px: number[], maxsizes_px: number): string => {
      let gridTemplateString: string = "";
      let totalHeight_px = sizes_px.reduce((sum, height) => sum + height, 0);

      if (totalHeight_px < maxsizes_px) {
         gridTemplateString = sizes_px.map(item => `minmax(0, ${item}px)`).join(" ");
      } else {
         gridTemplateString = sizes_px.map(item => `minmax(0, ${(item / totalHeight_px) * maxsizes_px}px)`).join(" ");
      }

      return gridTemplateString
   }


   const getImagesOrVideosAspects = (imgsIstartIend: [ImagesAndVideosItem[], number, number]): number[] => imgsIstartIend[0].slice(imgsIstartIend[1], imgsIstartIend[2]).map(item => item.aspect!)


   const resetImagesBlock = (): void => {
      setImagesAndVideos([])
   }




   useEffect(() => {
      if (imagesAndVideos.length) {
         setImagesAndVideosBlockStyle({ marginTop: "15px" });
      } else {
         setImagesAndVideosBlockStyle({});
      }
   }, [imagesAndVideos.length]);


   useEffect(() => {
      if (resize.value[0] > 460) {
         setContainerAspect(350 / 510);
      } else {
         setContainerAspect(550 / 510);
      }
   }, [resize.value[0]])


   useEffect(() => {
      if (panelRef.current) {
         const panelWidth = panelRef.current.getBoundingClientRect().width;
         setContainerSizes([panelWidth, panelWidth * containerAspect]);
      }
   }, [panelRef.current, resize.value[0], containerAspect])


   useEffect(() => {
      setImagesAndVideosBlockStyle({
         ...imagesAndVideosBlockStyle,
         maxHeight: `${containerSizes[1]}px`
      })
   }, [containerSizes[1], imagesAndVideosBlockStyle.marginTop])


   useEffect(() => {
      setGridDirection('vertical');
      setImagesAndVideosContainerStyle({});
      setFirstSubContainerStyle({});
      setSecondSubContainerStyle({});
      setThirdSubContainerStyle({});

      if (imagesAndVideos.length === 1) {
         setImagesAndVideosContainerStyle({
            width: "fit-content"
         });
      }

      if (imagesAndVideos.length >= 2) {
         const maxContainerHeight = containerSizes[1];
         const maxPossibleWidth_1_px = containerSizes[0] * 440 / 510;
         const aspect_1_hor: number = imagesAndVideos![0].aspect!;
         const aspect_2_hor: number = imagesAndVideos![1].aspect!;
         const aspect_2_ver: number = 1 / aspect_2_hor;
         const aspect_joint_12_hor: number = (aspect_1_hor * aspect_2_hor) / (aspect_1_hor + aspect_2_hor);
         const height_1_px: number = aspect_1_hor * containerSizes[0];
         const possibleWidth_1_px: number = maxContainerHeight / aspect_1_hor;
         let aspect_3_hor: number;
         let aspect_4_hor: number;
         let aspect_5_hor: number;
         let aspect_6_hor: number;
         let aspect_7_hor: number;
         let aspect_8_hor: number;
         let aspect_9_hor: number;
         let aspect_10_hor: number;
         let aspect_joint_25_hor: number;
         let direction: GridDirection = gridDirection;
         let rows: string = '';
         let cols: string = '';

         let cols_joint_12_hor: GridTemplateFr = getGridTemplateFr(imagesAndVideos.slice(0, 2).map(item => item.aspect!));
         let cols_joint_23_hor: GridTemplateFr;
         let cols_joint_45_hor: GridTemplateFr;
         let cols_joint_24_hor: GridTemplateFr;
         let cols_joint_35_hor: GridTemplateFr;
         let cols_joint_46_hor: GridTemplateFr;
         let cols_joint_36_hor: GridTemplateFr;
         let cols_joint_57_hor: GridTemplateFr;
         let cols_joint_37_hor: GridTemplateFr;
         let cols_joint_68_hor: GridTemplateFr;
         let cols_joint_58_hor: GridTemplateFr;
         let cols_joint_25_hor: GridTemplateFr;
         let cols_joint_69_hor: GridTemplateFr;


         //                   *
         if (imagesAndVideos.length === 2) {
            if (aspect_joint_12_hor < 0.23 && aspect_1_hor < 0.75 && aspect_2_hor < 0.75) {
               setGridDirection('vertical');
               rows = getGridTemplatePerPx([aspect_1_hor * containerSizes[0], aspect_2_hor * containerSizes[0]], maxContainerHeight);
            } else {
               setGridDirection('horizontal');
               cols = cols_joint_12_hor.gridTemplateColumns;
               rows = getGridTemplatePerPx([cols_joint_12_hor.jointAspect * containerSizes[0]], maxContainerHeight);
            }

            //                   *
         } else if (imagesAndVideos.length >= 3) {
            aspect_3_hor = imagesAndVideos![2].aspect!;
            cols_joint_23_hor = compose(
               getGridTemplateFr,
               getImagesOrVideosAspects
            )([imagesAndVideos, 1, 3]);


            if (imagesAndVideos.length === 3) {
               if (cols_joint_23_hor.jointAspect < 0.23 && aspect_1_hor < 0.45) {
                  direction = 'vertical';
               } else {
                  direction = 'horizontal';
               }

               setGridDirection(direction);

               if (direction === 'horizontal') {
                  const aspect_3_ver: number = 1 / aspect_3_hor;
                  const aspect_2_joint_23_ver: number = aspect_3_ver / (aspect_2_ver + aspect_3_ver);
                  const aspect_3_joint_23_ver: number = aspect_2_ver / (aspect_2_ver + aspect_3_ver);
                  let height_2_joint_23_ver_px: number;
                  let height_3_joint_23_ver_px: number;

                  if (possibleWidth_1_px < maxPossibleWidth_1_px) {
                     height_2_joint_23_ver_px = aspect_2_joint_23_ver * possibleWidth_1_px * aspect_1_hor;
                     height_3_joint_23_ver_px = aspect_3_joint_23_ver * possibleWidth_1_px * aspect_1_hor;
                     cols = `${possibleWidth_1_px / containerSizes[0]}fr ${1 - (possibleWidth_1_px / containerSizes[0])}fr`;
                     rows = getGridTemplatePerPx([height_2_joint_23_ver_px, height_3_joint_23_ver_px], maxContainerHeight);
                  } else {
                     height_2_joint_23_ver_px = aspect_2_joint_23_ver * 0.8 * (containerSizes[0] - 5) * aspect_1_hor;
                     height_3_joint_23_ver_px = aspect_3_joint_23_ver * 0.8 * (containerSizes[0] - 5) * aspect_1_hor;
                     cols = `0.8fr 0.2fr`;
                     rows = getGridTemplatePerPx([height_2_joint_23_ver_px, height_3_joint_23_ver_px], maxContainerHeight);
                  }

               } else if (direction === 'vertical') {
                  const height_joint_23_hor_px = cols_joint_23_hor.jointAspect * containerSizes[0];

                  cols = cols_joint_23_hor.gridTemplateColumns;
                  rows = getGridTemplatePerPx([height_1_px, height_joint_23_hor_px], maxContainerHeight);
               }


               //                   *
            } else if (imagesAndVideos.length >= 4) {
               aspect_4_hor = imagesAndVideos![3].aspect!;
               cols_joint_24_hor = compose(
                  getGridTemplateFr,
                  getImagesOrVideosAspects
               )([imagesAndVideos, 1, 4]);

               const cols_joint_24_ver = compose(
                  getGridTemplateFr,
                  getImagesOrVideosAspects
               )([imagesAndVideos.map(item => ({ ...item, aspect: (1 / item.aspect!) })), 1, 4]);


               if (imagesAndVideos.length === 4) {
                  if (cols_joint_24_hor.jointAspect < 0.2 && aspect_1_hor < 0.45) {
                     direction = 'vertical';
                  } else {
                     direction = 'horizontal';
                  }

                  setGridDirection(direction);

                  if (direction === 'horizontal') {
                     const heights_joint_24_ver = cols_joint_24_ver.sizes as number[];

                     if (possibleWidth_1_px < maxPossibleWidth_1_px) {
                        cols = `${possibleWidth_1_px / containerSizes[0]}fr ${1 - (possibleWidth_1_px / containerSizes[0])}fr`;
                        rows = getGridTemplatePerPx(heights_joint_24_ver.map(item => item * height_1_px), maxContainerHeight);
                     } else {
                        cols = `0.8fr 0.2fr`;
                        rows = getGridTemplatePerPx(heights_joint_24_ver.map(item => item * 0.8 * (containerSizes[0] - 5) * aspect_1_hor), maxContainerHeight);
                     }

                  } else if (direction === 'vertical') {
                     const height_joint_234_hor_px = cols_joint_24_hor.jointAspect * containerSizes[0];

                     cols = cols_joint_23_hor.gridTemplateColumns;
                     rows = getGridTemplatePerPx([height_1_px, height_joint_234_hor_px], maxContainerHeight);
                  }


                  //                   *
               } else if (imagesAndVideos.length >= 5) {
                  aspect_5_hor = imagesAndVideos![4].aspect!;
                  cols_joint_45_hor = compose(
                     getGridTemplateFr,
                     getImagesOrVideosAspects
                  )([imagesAndVideos, 3, 5]);
                  cols_joint_35_hor = compose(
                     getGridTemplateFr,
                     getImagesOrVideosAspects
                  )([imagesAndVideos, 2, 5]);

                  const aspect_joint_12_hor = cols_joint_12_hor.jointAspect;
                  const aspect_joint_23_hor = cols_joint_23_hor.jointAspect;
                  const aspect_joint_45_hor = cols_joint_45_hor.jointAspect;
                  const aspect_joint_35_hor = cols_joint_35_hor.jointAspect;

                  if (imagesAndVideos.length === 5) {
                     if ((aspect_joint_23_hor! < 0.23) && (aspect_1_hor < 0.45) && (aspect_4_hor < 0.45) && (aspect_5_hor < 0.45)) {
                        direction = 'vertical';
                     } else {
                        direction = 'horizontal';
                     }

                     setGridDirection(direction);

                     if (direction === 'vertical') {
                        setSecondSubContainerStyle({ gridTemplateColumns: cols_joint_23_hor.gridTemplateColumns });
                        setThirdSubContainerStyle({ gridTemplateColumns: cols_joint_45_hor.gridTemplateColumns });

                        rows = getGridTemplatePerPx([height_1_px, aspect_joint_23_hor * containerSizes[0], aspect_joint_45_hor * containerSizes[0]], maxContainerHeight);

                     } else if (direction === 'horizontal') {
                        setFirstSubContainerStyle({ gridTemplateColumns: cols_joint_12_hor.gridTemplateColumns });
                        setSecondSubContainerStyle({ gridTemplateColumns: cols_joint_35_hor.gridTemplateColumns });

                        rows = getGridTemplatePerPx([aspect_joint_12_hor * containerSizes[0], aspect_joint_35_hor * containerSizes[0]], maxContainerHeight);
                     }


                     //                   *
                  } else if (imagesAndVideos.length >= 6) {
                     aspect_6_hor = imagesAndVideos![5].aspect!;
                     cols_joint_46_hor = compose(
                        getGridTemplateFr,
                        getImagesOrVideosAspects
                     )([imagesAndVideos, 3, 6]);
                     cols_joint_36_hor = compose(
                        getGridTemplateFr,
                        getImagesOrVideosAspects
                     )([imagesAndVideos, 2, 6]);

                     const aspect_joint_46_hor = cols_joint_46_hor.jointAspect;
                     const aspect_joint_36_hor = cols_joint_36_hor.jointAspect;

                     if (imagesAndVideos.length === 6) {
                        if ((aspect_joint_23_hor! < 0.23) && (aspect_1_hor < 0.45) && (aspect_4_hor < 0.45) && (aspect_5_hor < 0.45)) {
                           direction = 'vertical';
                        } else {
                           direction = 'horizontal';
                        }

                        setGridDirection(direction);

                        if (direction === 'vertical') {
                           setSecondSubContainerStyle({ gridTemplateColumns: cols_joint_23_hor.gridTemplateColumns });
                           setThirdSubContainerStyle({ gridTemplateColumns: cols_joint_46_hor.gridTemplateColumns });

                           rows = getGridTemplatePerPx([height_1_px, aspect_joint_23_hor * containerSizes[0], aspect_joint_46_hor * containerSizes[0]], maxContainerHeight);

                        } else if (direction === 'horizontal') {
                           setFirstSubContainerStyle({ gridTemplateColumns: cols_joint_12_hor.gridTemplateColumns });
                           setSecondSubContainerStyle({ gridTemplateColumns: cols_joint_36_hor.gridTemplateColumns });

                           rows = getGridTemplatePerPx([aspect_joint_12_hor * containerSizes[0], aspect_joint_36_hor * containerSizes[0]], maxContainerHeight);
                        }


                        //                   *
                     } else if (imagesAndVideos.length >= 7) {
                        aspect_7_hor = imagesAndVideos![6].aspect!;
                        cols_joint_57_hor = compose(
                           getGridTemplateFr,
                           getImagesOrVideosAspects
                        )([imagesAndVideos, 4, 7]);
                        cols_joint_37_hor = compose(
                           getGridTemplateFr,
                           getImagesOrVideosAspects
                        )([imagesAndVideos, 2, 7]);

                        const aspect_joint_24_hor = cols_joint_24_hor.jointAspect;
                        const aspect_joint_57_hor = cols_joint_57_hor.jointAspect;
                        const aspect_joint_37_hor = cols_joint_37_hor.jointAspect;

                        if (imagesAndVideos.length === 7) {
                           if ((aspect_joint_23_hor! < 0.23) && (aspect_1_hor < 0.45) && (aspect_4_hor < 0.45) && (aspect_5_hor < 0.45)) {
                              direction = 'vertical';
                           } else {
                              direction = 'horizontal';
                           }

                           setGridDirection(direction);

                           if (direction === 'vertical') {
                              setSecondSubContainerStyle({ gridTemplateColumns: cols_joint_24_hor.gridTemplateColumns });
                              setThirdSubContainerStyle({ gridTemplateColumns: cols_joint_57_hor.gridTemplateColumns });

                              rows = getGridTemplatePerPx([height_1_px, aspect_joint_24_hor * containerSizes[0], aspect_joint_57_hor * containerSizes[0]], maxContainerHeight);

                           } else if (direction === 'horizontal') {
                              setFirstSubContainerStyle({ gridTemplateColumns: cols_joint_12_hor.gridTemplateColumns });
                              setSecondSubContainerStyle({ gridTemplateColumns: cols_joint_37_hor.gridTemplateColumns });

                              rows = getGridTemplatePerPx([aspect_joint_12_hor * containerSizes[0], aspect_joint_37_hor * containerSizes[0]], maxContainerHeight);
                           }


                           //                   *
                        } else if (imagesAndVideos.length >= 8) {
                           aspect_8_hor = imagesAndVideos![7].aspect!;
                           cols_joint_58_hor = compose(
                              getGridTemplateFr,
                              getImagesOrVideosAspects
                           )([imagesAndVideos, 4, 8]);
                           cols_joint_68_hor = compose(
                              getGridTemplateFr,
                              getImagesOrVideosAspects
                           )([imagesAndVideos, 5, 8]);

                           const aspect_joint_24_hor = cols_joint_24_hor.jointAspect;
                           const aspect_joint_58_hor = cols_joint_58_hor.jointAspect;
                           const aspect_joint_68_hor = cols_joint_68_hor.jointAspect;

                           if (imagesAndVideos.length === 8) {
                              if ((aspect_joint_23_hor! < 0.23) && (aspect_1_hor < 0.45) && (aspect_4_hor < 0.45) && (aspect_5_hor < 0.45)) {
                                 direction = 'vertical';
                              } else {
                                 direction = 'horizontal';
                              }

                              setGridDirection(direction);

                              if (direction === 'vertical') {
                                 setSecondSubContainerStyle({ gridTemplateColumns: cols_joint_24_hor.gridTemplateColumns });
                                 setThirdSubContainerStyle({ gridTemplateColumns: cols_joint_58_hor.gridTemplateColumns });

                                 rows = getGridTemplatePerPx([height_1_px, aspect_joint_24_hor * containerSizes[0], aspect_joint_58_hor * containerSizes[0]], maxContainerHeight);

                              } else if (direction === 'horizontal') {
                                 setFirstSubContainerStyle({ gridTemplateColumns: cols_joint_12_hor.gridTemplateColumns });
                                 setSecondSubContainerStyle({ gridTemplateColumns: cols_joint_35_hor.gridTemplateColumns });
                                 setThirdSubContainerStyle({ gridTemplateColumns: cols_joint_68_hor.gridTemplateColumns });

                                 rows = getGridTemplatePerPx([aspect_joint_12_hor * containerSizes[0], aspect_joint_35_hor * containerSizes[0], aspect_joint_68_hor * containerSizes[0]], maxContainerHeight);
                              }


                              //                   *
                           } else if (imagesAndVideos.length >= 9) {
                              aspect_9_hor = imagesAndVideos![8].aspect!;
                              cols_joint_25_hor = compose(
                                 getGridTemplateFr,
                                 getImagesOrVideosAspects
                              )([imagesAndVideos, 1, 5]);
                              cols_joint_69_hor = compose(
                                 getGridTemplateFr,
                                 getImagesOrVideosAspects
                              )([imagesAndVideos, 5, 9]);

                              aspect_joint_25_hor = cols_joint_25_hor.jointAspect;
                              const aspect_joint_35_hor = cols_joint_35_hor.jointAspect;
                              const aspect_joint_69_hor = cols_joint_69_hor.jointAspect;

                              if (imagesAndVideos.length === 9) {
                                 if ((aspect_joint_23_hor! < 0.23) && (aspect_1_hor < 0.45) && (aspect_4_hor < 0.45) && (aspect_5_hor < 0.45)) {
                                    direction = 'vertical';
                                 } else {
                                    direction = 'horizontal';
                                 }

                                 setGridDirection(direction);

                                 if (direction === 'vertical') {
                                    setSecondSubContainerStyle({ gridTemplateColumns: cols_joint_25_hor.gridTemplateColumns });
                                    setThirdSubContainerStyle({ gridTemplateColumns: cols_joint_69_hor.gridTemplateColumns });

                                    rows = getGridTemplatePerPx([height_1_px, aspect_joint_25_hor * containerSizes[0], aspect_joint_69_hor * containerSizes[0]], maxContainerHeight);

                                 } else if (direction === 'horizontal') {
                                    setFirstSubContainerStyle({ gridTemplateColumns: cols_joint_12_hor.gridTemplateColumns });
                                    setSecondSubContainerStyle({ gridTemplateColumns: cols_joint_35_hor.gridTemplateColumns });
                                    setThirdSubContainerStyle({ gridTemplateColumns: cols_joint_69_hor.gridTemplateColumns });

                                    rows = getGridTemplatePerPx([aspect_joint_12_hor * containerSizes[0], aspect_joint_35_hor * containerSizes[0], aspect_joint_69_hor * containerSizes[0]], maxContainerHeight);
                                 }


                                 //                   *
                              } else if (imagesAndVideos.length === 10) {
                                 aspect_10_hor = imagesAndVideos![9].aspect!;

                                 cols_joint_36_hor = compose(
                                    getGridTemplateFr,
                                    getImagesOrVideosAspects
                                 )([imagesAndVideos, 2, 6]);
                                 const cols_joint_610_hor = compose(
                                    getGridTemplateFr,
                                    getImagesOrVideosAspects
                                 )([imagesAndVideos, 5, 10]);
                                 const cols_joint_710_hor = compose(
                                    getGridTemplateFr,
                                    getImagesOrVideosAspects
                                 )([imagesAndVideos, 6, 10]);

                                 const aspect_joint_36_hor = cols_joint_36_hor.jointAspect;
                                 const aspect_joint_610_hor = cols_joint_610_hor.jointAspect;
                                 const aspect_joint_710_hor = cols_joint_710_hor.jointAspect;

                                 if ((aspect_joint_23_hor! < 0.23) && (aspect_1_hor < 0.45) && (aspect_4_hor < 0.45) && (aspect_5_hor < 0.45)) {
                                    direction = 'vertical';
                                 } else {
                                    direction = 'horizontal';
                                 }

                                 setGridDirection(direction);

                                 if (direction === 'vertical') {
                                    setSecondSubContainerStyle({ gridTemplateColumns: cols_joint_25_hor!.gridTemplateColumns });
                                    setThirdSubContainerStyle({ gridTemplateColumns: cols_joint_610_hor.gridTemplateColumns });

                                    rows = getGridTemplatePerPx([height_1_px, aspect_joint_25_hor! * containerSizes[0], aspect_joint_610_hor * containerSizes[0]], maxContainerHeight);

                                 } else if (direction === 'horizontal') {
                                    setFirstSubContainerStyle({ gridTemplateColumns: cols_joint_12_hor.gridTemplateColumns });
                                    setSecondSubContainerStyle({ gridTemplateColumns: cols_joint_36_hor.gridTemplateColumns });
                                    setThirdSubContainerStyle({ gridTemplateColumns: cols_joint_710_hor.gridTemplateColumns });

                                    rows = getGridTemplatePerPx([aspect_joint_12_hor * containerSizes[0], aspect_joint_36_hor * containerSizes[0], aspect_joint_710_hor * containerSizes[0]], maxContainerHeight);
                                 }
                              }
                           }
                        }
                     }
                  }
               }
            }
         }

         setImagesAndVideosContainerStyle({
            gridTemplateRows: rows!,
            gridTemplateColumns: cols!
         });
      }
   }, [imagesAndVideos.length, gridDirection, containerSizes[0]]);



   return {
      imagesAndVideos,
      setImagesAndVideos,
      imagesAndVideosBlockStyle,
      gridDirection,
      imagesAndVideosContainerStyle,
      firstSubContainerStyle,
      secondSubContainerStyle,
      thirdSubContainerStyle,
      panelRef,
      containerSizes,
      addImageOrVideo,
      deleteImageOrVideo,
      resetImagesBlock
   }
}