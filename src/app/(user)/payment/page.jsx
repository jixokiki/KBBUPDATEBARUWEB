// "use client"
// import useAuth from "@/app/hooks/useAuth";
// import Navbar from "@/components/Navbar";
// import { db, storage } from "@/firebase/firebase";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   serverTimestamp,
//   setDoc,
//   updateDoc,
//   where, query
// } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// const Purchase = () => {
//   const { user, userProfile } = useAuth();
//   const router = useRouter();
//   useEffect(() => {
//     if (user && userProfile.role === "admin") {
//       router.push("/admin");
//     }
//   }, [user, userProfile, router]);

//   const [file, setFile] = useState(null);
//   const [itemName, setItemName] = useState("");
//   const [category, setCategory] = useState("fikom");
//   const [quantity, setQuantity] = useState("");
//   const [status, setStatus] = useState("ready");
//   const [percentage, setPercentage] = useState(null);
//   const [approvedData, setApprovedData] = useState([]);
//   const [paymentProofs, setPaymentProofs] = useState([]);

//   useEffect(() => {
//     const unsubscribePurchases = onSnapshot(
//       query(collection(db, "pembelian1"), where("status", "==", "pembelian di acc")),
//       (snapshot) => {
//         const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         setApprovedData(list);
//       },
//       (error) => {
//         console.error("Error getting approved purchases: ", error);
//       }
//     );
  
//     return () => unsubscribePurchases();
//   }, []);
  

//   // Menggunakan useEffect untuk mengambil data bukti pembayaran
//   useEffect(() => {
//     const unsubscribePayments = onSnapshot(
//       collection(db, "buktiPembayaran"),
//       (snapshot) => {
//         const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//         setPaymentProofs(list);
//       },
//       (error) => {
//         console.error("Error getting payment proofs: ", error);
//       }
//     );

//     return () => unsubscribePayments();
//   }, []);

//   const uploadFile = async (file) => {
//     try {
//       const storageRef = ref(
//         storage,
//         "pembelian1/" +
//           new Date().getTime() +
//           file.name.replace(" ", "%20") +
//           "KBB"
//       );
//       const uploadTask = uploadBytesResumable(storageRef, file);

//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           setPercentage(progress);
//         },
//         (error) => {
//           console.error("Error uploading file: ", error);
//         }
//       );

//       await uploadTask;
//       const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
//       return downloadURL;
//     } catch (error) {
//       console.error("Error uploading file: ", error);
//       throw error;
//     }
//   };

//   const handleAddPurchase = async (e) => {
//     e.preventDefault();

//     try {
//       const downloadURL = await uploadFile(file);
//       const purchaseData = {
//         id: new Date().getTime() + user.uid + "PEMBELIAN",
//         image: downloadURL,
//         itemName: itemName,
//         category: category,
//         quantity: quantity,
//         status: status,
//         timeStamp: serverTimestamp(),
//       };

//       await setDoc(doc(db, "pembelian1", purchaseData.id), purchaseData);

//       setFile(null);
//       setItemName("");
//       setCategory("fikom");
//       setQuantity("");
//       setStatus("ready");
//       setPercentage(null);
//       alert("Pembelian berhasil ditambahkan!");
//     } catch (error) {
//       console.error("Error adding purchase: ", error);
//     }
//   };

//   const handleAccPurchase = async (id) => {
//     try {
//       const purchaseDocRef = doc(db, "pembelian1", id);
//       await updateDoc(purchaseDocRef, { status: "pembelian di acc" });
//       alert("Status pembelian berhasil diubah!");
//     } catch (error) {
//       console.error("Error updating purchase status: ", error);
//     }
//   };

//   const handleUploadPayment = async (e) => {
//     e.preventDefault();

//     try {
//       const downloadURL = await uploadFile(file);
//       const paymentData = {
//         id: new Date().getTime() + user.uid + "BUKTIPAYMENT",
//         image: downloadURL,
//         itemName: itemName,
//         category: category,
//         quantity: quantity,
//         timeStamp: serverTimestamp(),
//         statusPembayaran: "terupload",
//       };

//       await setDoc(doc(db, "buktiPembayaran", paymentData.id), paymentData);

//       setFile(null);
//       setItemName("");
//       setCategory("fikom");
//       setQuantity("");
//       setPercentage(null);
//       alert("Bukti pembayaran berhasil diunggah!");
//     } catch (error) {
//       console.error("Error uploading payment proof: ", error);
//     }
//   };

//   const handleUpdatePurchaseStatus = async (id, newStatus) => {
//     try {
//       await updateDoc(doc(db, "pembelian1", id), { status: newStatus });
//       alert("Status pembelian berhasil diubah!");

//       // Opsional: Update local state approvedData (jika diperlukan)
//       const updatedApprovedData = approvedData.map((purchase) =>
//         purchase.id === id ? { ...purchase, status: newStatus } : purchase
//       );
//       setApprovedData(updatedApprovedData);
//     } catch (error) {
//       console.error("Error updating purchase status: ", error);
//     }
//   };

//   return (
//     <div className="w-[100%] mx-auto mt-32">
//       <Navbar />
//       <div className="w-[90%] flex justify-center items-center gap-3 mb-10">
//         <h1 className="text-3xl font-semibold mb-3">Purchase Form</h1>
//       </div>
//       <div className="w-[90%] mx-auto mt-10">
//         <h2 className="text-2xl font-semibold mb-5">Approved Purchases</h2>
//         <div className="overflow-x-auto">
//           <table className="table w-full">
//             <thead>
//               <tr>
//                 <th>No.</th>
//                 <th>Image</th>
//                 <th>Item Name</th>
//                 <th>Category</th>
//                 <th>Quantity</th>
//                 <th>Price</th>
//                 <th>Status</th>
//                 <th>TimeStamp</th>
//                 <th>Status Pembayaran</th>
//                 <th>Action</th>
//               </tr>
//             </thead>
//             <tbody>
//               {approvedData.map((purchase, index) => (
//                 <tr key={purchase.id}>
//                   <td>{index + 1}</td>
//                   <td>
//                     <img
//                       src={purchase.image}
//                       alt={purchase.itemName}
//                       className="w-12 h-12 object-cover"
//                     />
//                   </td>
//                   <td>{purchase.itemName}</td>
//                   <td>{purchase.category}</td>
//                   <td>{purchase.quantity}</td>
//                   <td>{purchase.price}</td>
//                   <td>{purchase.status}</td>
//                   <td>
//                     {purchase.timeStamp
//                       ? new Date(
//                           purchase.timeStamp.seconds * 1000
//                         ).toLocaleString()
//                       : "N/A"}
//                   </td>
//                   <td>
//                     {paymentProofs.find(
//                       (proof) => proof.itemName === purchase.itemName
//                     )?.statusPembayaran || "Pending"}
//                   </td>
//                   <td>
//                     <button
//                       className="btn btn-primary"
//                       onClick={() =>
//                         handleUpdatePurchaseStatus(purchase.id, "menunggu proses gudang")
//                       }
//                     >
//                       Update Status
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//       <div className="w-[90%] mx-auto mt-10">
//         <h2 className="text-2xl font-semibold mb-5">Upload Payment Proof</h2>
//         <div className="mb-5 text-lg">No. Rekening: 59796486447</div>
//         <form onSubmit={handleUploadPayment}>
//           <div className="py-4">
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="image">Payment Proof Image</label>
//               <input
//                 type="file"
//                 name="image"
//                 id="image"
//                 required
//                 onChange={(e) => setFile(e.target.files[0])}
//               />
//               {percentage !== null && percentage < 100 ? (
//                 <progress
//                   className="progress progress-accent w-56"
//                   value={percentage}
//                   max="100"
//                 ></progress>
//               ) : (
//                 percentage === 100 && (
//                   <div className="text-green-500 font-semibold">
//                     Upload Completed
//                   </div>
//                 )
//               )}
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="itemName">Item Name</label>
//               <input
//                 type="text"
//                 name="itemName"
//                 id="itemName"
//                 placeholder="Enter item name"
//                 value={itemName}
//                 onChange={(e) => setItemName(e.target.value)}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="category">Category</label>
//               <select
//                 name="category"
//                 id="category"
//                 value={category}
//                 onChange={(e) => setCategory(e.target.value)}
//                 className="select select-bordered w-full"
//               >
//                 <option value="3Kg">3 Kg</option>
//                 <option value="5Kg">5 Kg</option>
//                 <option value="10Kg">10 Kg</option>
//                 <option value="15Kg">15 Kg</option>
//                 <option value="20Kg">20 Kg</option>
//                 <option value="25Kg">25 Kg</option>
//               </select>
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="quantity">Quantity</label>
//               <input
//                 type="number"
//                 name="quantity"
//                 id="quantity"
//                 placeholder="Enter quantity"
//                 value={quantity}
//                 onChange={(e) => setQuantity(e.target.value)}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//           </div>
//           <div className="w-[100%] mx-auto mt-7">
//             <p>Note: Upload bukti payment ketika status berubah menjadi pembelian di acc,</p>
//             <p>Pembayaran bisa dilakukan dengan cara transfer sesuai dengan harga yang tertera diatas kolom Approved Purchases</p>
//           </div>
//           <div className="modal-action">
//             <button className="btn btn-primary" type="submit">
//               Upload Payment Proof
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Purchase;




//INI YANG FIXX YAA AWAS AJA LUPA
// "use client";
// import useAuth from "@/app/hooks/useAuth";
// import Navbar from "@/components/Navbar";
// import { db, storage } from "@/firebase/firebase";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   serverTimestamp,
//   setDoc,
// } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// const Purchase = () => {
//   const { user, userProfile } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (user && userProfile.role === "admin") {
//       router.push("/admin");
//     }
//   }, [user, userProfile, router]);

//   const [file, setFile] = useState(null);
//   const [productName, setProductName] = useState("");
//   const [deliveryAddress, setDeliveryAddress] = useState("");
//   const [contact, setContact] = useState("");
//   const [quantityRice, setQuantityRice] = useState("");
//   const [packageCategory, setPackageCategory] = useState("");
//   const [packageQuantity, setPackageQuantity] = useState("");
//   const [percentage, setPercentage] = useState(null);
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const unsub = onSnapshot(
//       collection(db, "pembelian1"),
//       (snapshot) => {
//         let list = [];
//         snapshot.docs.forEach((doc) => {
//           list.push({ id: doc.id, ...doc.data() });
//         });
//         setData(list);
//       },
//       (error) => {
//         console.log(error);
//       }
//     );

//     return () => {
//       unsub();
//     };
//   }, []);

//   const uploadFile = async (file) => {
//     return new Promise((resolve, reject) => {
//       const storageRef = ref(
//         storage,
//         "pembelian1/" +
//           new Date().getTime() +
//           file.name.replace(" ", "%20") +
//           "KBB"
//       );
//       const uploadTask = uploadBytesResumable(storageRef, file);

//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress =
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           setPercentage(progress);
//           switch (snapshot.state) {
//             case "paused":
//               console.log("Upload is paused");
//               break;
//             case "running":
//               console.log("Upload is running");
//               break;
//           }
//         },
//         (error) => {
//           reject(error);
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//             resolve(downloadURL);
//           });
//         }
//       );
//     });
//   };

//   const handleAddPurchase = async (e) => {
//     e.preventDefault();

//     try {
//       const downloadURL = file ? await uploadFile(file) : null;
//       const purchaseData = {
//         id: new Date().getTime() + user.uid + "PEMBELIAN",
//         image: downloadURL,
//         productName: productName,
//         deliveryAddress: deliveryAddress,
//         contact: contact,
//         quantityRice: quantityRice,
//         packageCategory: packageCategory,
//         packageQuantity: packageQuantity,
//         status: "product",
//         timeStamp: serverTimestamp(),
//       };

//       await setDoc(doc(db, "pembelian1", purchaseData.id), purchaseData);

//       setFile(null);
//       setProductName("");
//       setDeliveryAddress("");
//       setContact("");
//       setQuantityRice("");
//       setPackageCategory("");
//       setPackageQuantity("");
//       setPercentage(null);
//       alert("Order request successfully added!");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   return (
//     <div className="w-[100%] mx-auto mt-32">
//       <Navbar />
//       <div className="w-[90%] flex justify-center items-center gap-3 mb-10">
//         <h1 className="text-3xl font-semibold mb-3">Request Order Form</h1>
//       </div>
//       <div className="w-[90%] mx-auto mt-10">
//         <h2 className="text-2xl font-semibold mb-4">Order Requests</h2>
//         <table className="table-auto w-full">
//           <thead>
//             <tr>
//               <th>Product Name</th>
//               <th>Delivery Address</th>
//               <th>Contact</th>
//               <th>Quantity of Rice</th>
//               <th>Package Category</th>
//               <th>Package Quantity</th>
//               <th>Status</th>
//               <th>Time Stamp</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item) => (
//               <tr key={item.id}>
//                 <td>{item.productName}</td>
//                 <td>{item.deliveryAddress}</td>
//                 <td>{item.contact}</td>
//                 <td>{item.quantityRice}</td>
//                 <td>{item.packageCategory}</td>
//                 <td>{item.packageQuantity}</td>
//                 <td>{item.status}</td>
//                 <td>{item.timeStamp?.toDate().toString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="w-[90%] mx-auto mt-10">
//         <h2 className="text-2xl font-semibold mb-5">Upload Payment Proof</h2>
//         <div className="mb-5 text-lg">No. Rekening: 59796486447</div>
//         <form onSubmit={handleUploadPayment}>
//           <div className="py-4">
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="image">Payment Proof Image</label>
//               <input
//                 type="file"
//                 name="image"
//                 id="image"
//                 required
//                 onChange={(e) => setFile(e.target.files[0])}
//               />
//               {percentage !== null && percentage < 100 ? (
//                 <progress
//                   className="progress progress-accent w-56"
//                   value={percentage}
//                   max="100"
//                 ></progress>
//               ) : (
//                 percentage === 100 && (
//                   <div className="text-green-500 font-semibold">
//                     Upload Completed
//                   </div>
//                 )
//               )}
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="productName">Product Name</label>
//               <input
//                 type="text"
//                 name="productName"
//                 id="productName"
//                 placeholder="Enter product name"
//                 value={productName}
//                 onChange={(e) => setProductName(e.target.value)}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="deliveryAddress">Delivery Address</label>
//               <input
//                 type="text"
//                 name="deliveryAddress"
//                 id="deliveryAddress"
//                 placeholder="Enter delivery address"
//                 value={deliveryAddress}
//                 onChange={(e) => setDeliveryAddress(e.target.value)}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="contact">Contact</label>
//               <input
//                 type="text"
//                 name="contact"
//                 id="contact"
//                 placeholder="Enter contact"
//                 value={contact}
//                 onChange={(e) => setContact(e.target.value)}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="quantityRice">Quantity of Rice</label>
//               <input
//                 type="text"
//                 name="quantityRice"
//                 id="quantityRice"
//                 placeholder="Enter quantity of rice (e.g., 5 kg)"
//                 value={quantityRice}
//                 onChange={(e) => setQuantityRice(e.target.value)}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="packageCategory">Package Category</label>
//               <input
//                 type="text"
//                 name="packageCategory"
//                 id="packageCategory"
//                 placeholder="Enter package category"
//                 value={packageCategory}
//                 onChange={(e) => setPackageCategory(e.target.value)}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="packageQuantity">Package Quantity</label>
//               <input
//                 type="text"
//                 name="packageQuantity"
//                 id="packageQuantity"
//                 placeholder="Enter package quantity (e.g., 2 packs)"
//                 value={packageQuantity}
//                 onChange={(e) => setPackageQuantity(e.target.value)}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//           </div>
//           <div className="w-[100%] mx-auto mt-7">
//             <p>Note: Upload bukti payment ketika status berubah menjadi pembelian di acc,</p>
//             <p>Pembayaran bisa dilakukan dengan cara transfer sesuai dengan harga yang tertera diatas kolom Approved Purchases</p>
//           </div>
//           <div className="modal-action">
//             <button className="btn btn-primary" type="submit">
//               Upload Payment Proof
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Purchase;



//INI YANG FIX KEDUA YAA AWAS AJA LUPA
// "use client";
// import useAuth from "@/app/hooks/useAuth";
// import Navbar from "@/components/Navbar";
// import { db, storage } from "@/firebase/firebase";
// import {
//   collection,
//   doc,
//   onSnapshot,
//   serverTimestamp,
//   setDoc,
//   updateDoc,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";

// const Purchase = () => {
//   const { user, userProfile } = useAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (user && userProfile.role === "admin") {
//       router.push("/admin");
//     }
//   }, [user, userProfile, router]);

//   const [file, setFile] = useState(null);
//   const [productName, setProductName] = useState("");
//   const [deliveryAddress, setDeliveryAddress] = useState("");
//   const [contact, setContact] = useState("");
//   const [quantityRice, setQuantityRice] = useState("");
//   const [packageCategory, setPackageCategory] = useState("");
//   const [packageQuantity, setPackageQuantity] = useState("");
//   const [percentage, setPercentage] = useState(null);
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     const unsub = onSnapshot(
//       collection(db, "pembelian1"),
//       (snapshot) => {
//         let list = [];
//         snapshot.docs.forEach((doc) => {
//           list.push({ id: doc.id, ...doc.data() });
//         });
//         setData(list);
//       },
//       (error) => {
//         console.log(error);
//       }
//     );

//     return () => {
//       unsub();
//     };
//   }, []);

//   const uploadFile = async (file) => {
//     return new Promise((resolve, reject) => {
//       const storageRef = ref(
//         storage,
//         "pembelian1/" +
//           new Date().getTime() +
//           file.name.replace(" ", "%20") +
//           "KBB"
//       );
//       const uploadTask = uploadBytesResumable(storageRef, file);

//       uploadTask.on(
//         "state_changed",
//         (snapshot) => {
//           const progress =
//             (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
//           setPercentage(progress);
//           switch (snapshot.state) {
//             case "paused":
//               console.log("Upload is paused");
//               break;
//             case "running":
//               console.log("Upload is running");
//               break;
//           }
//         },
//         (error) => {
//           reject(error);
//         },
//         () => {
//           getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
//             resolve(downloadURL);
//           });
//         }
//       );
//     });
//   };

//   const handleAddPurchase = async (e) => {
//     e.preventDefault();

//     try {
//       const downloadURL = file ? await uploadFile(file) : null;
//       const purchaseData = {
//         id: new Date().getTime() + user.uid + "PEMBELIAN",
//         image: downloadURL,
//         productName: productName,
//         deliveryAddress: deliveryAddress,
//         contact: contact,
//         quantityRice: quantityRice,
//         packageCategory: packageCategory,
//         packageQuantity: packageQuantity,
//         status: "product",
//         timeStamp: serverTimestamp(),
//       };

//       await setDoc(doc(db, "pembelian1", purchaseData.id), purchaseData);

//       setFile(null);
//       setProductName("");
//       setDeliveryAddress("");
//       setContact("");
//       setQuantityRice("");
//       setPackageCategory("");
//       setPackageQuantity("");
//       setPercentage(null);
//       alert("Order request successfully added!");
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   const handleUploadPayment = async (e) => {
//     e.preventDefault();

//     try {
//       // Mengambil data pembelian berdasarkan productName dan deliveryAddress
//       const querySnapshot = await getDocs(
//         query(
//           collection(db, "pembelian1"),
//           where("productName", "==", productName),
//           where("deliveryAddress", "==", deliveryAddress)
//         )
//       );

//       if (querySnapshot.empty) {
//         alert("Data transfer dan data barang tidak sesuai.");
//         return;
//       }

//       querySnapshot.forEach(async (doc) => {
//         try {
//           // Update status menjadi "menunggu konfirmasi gudang"
//           await updateDoc(doc.ref, { status: "bukti payment terupload" });
//           alert("Upload bukti pembayaran berhasil!");
//         } catch (error) {
//           console.error("Error updating document:", error);
//         }
//       });
//     } catch (error) {
//       console.error("Error getting documents:", error);
//     }
//   };

//   return (
//     <div className="w-[100%] mx-auto mt-32">
//       <Navbar />
//       <div className="w-[90%] flex justify-center items-center gap-3 mb-10">
//         <h1 className="text-3xl font-semibold mb-3">Request Order Form</h1>
//       </div>
//       <div className="w-[90%] mx-auto mt-10">
//         <h2 className="text-2xl font-semibold mb-4">Order Requests</h2>
//         <table className="table-auto w-full">
//           <thead>
//             <tr>
//               <th>Product Name</th>
//               <th>Delivery Address</th>
//               <th>Contact</th>
//               <th>Quantity of Rice</th>
//               <th>Package Category</th>
//               <th>Package Quantity</th>
//               <th>Status</th>
//               <th>Time Stamp</th>
//             </tr>
//           </thead>
//           <tbody>
//             {data.map((item) => (
//               <tr key={item.id}>
//                 <td>{item.productName}</td>
//                 <td>{item.deliveryAddress}</td>
//                 <td>{item.contact}</td>
//                 <td>{item.quantityRice}</td>
//                 <td>{item.packageCategory}</td>
//                 <td>{item.packageQuantity}</td>
//                 <td>{item.status}</td>
//                 <td>{item.timeStamp?.toDate().toString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//       <div className="w-[90%] mx-auto mt-10">
//         <h2 className="text-2xl font-semibold mb-5">Upload Payment Proof</h2>
//         <div className="mb-5 text-lg">No. Rekening: 59796486447</div>
//         <form onSubmit={handleUploadPayment}>
//           <div className="py-4">
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="image">Payment Proof Image</label>
//               <input
//                 type="file"
//                 name="image"
//                 id="image"
//                 required
//                 onChange={(e) => setFile(e.target.files[0])}
//               />
//               {percentage !== null && percentage < 100 ? (
//                 <progress
//                   className="progress progress-accent w-56"
//                   value={percentage}
//                   max="100"
//                 ></progress>
//               ) : (
//                 percentage === 100 && (
//                   <div className="text-green-500 font-semibold">
//                     Upload Completed
//                   </div>
//                 )
//               )}
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="productName">Product Name</label>
//               <input
//                 type="text"
//                 name="productName"
//                 id="productName"
//                 placeholder="Enter product name"
//                 value={productName}
//                 onChange={(e) => setProductName(e.target.value)}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//             <div className="flex flex-col gap-3 mb-3">
//               <label htmlFor="deliveryAddress">Delivery Address</label>
//               <input
//                 type="text"
//                 name="deliveryAddress"
//                 id="deliveryAddress"
//                 placeholder="Enter delivery address"
//                 value={deliveryAddress}
//                 onChange={(e) => setDeliveryAddress(e.target.value)}
//                 required
//                 className="input input-bordered w-full"
//               />
//             </div>
//           </div>
//           <div className="w-[100%] mx-auto mt-7">
//             <p>Note: Upload bukti payment ketika status berubah menjadi pembelian di acc,</p>
//             <p>Pembayaran bisa dilakukan dengan cara transfer sesuai dengan harga yang tertera diatas kolom Approved Purchases</p>
//           </div>
//           <div className="modal-action">
//             <button className="btn btn-primary" type="submit">
//               Upload Payment Proof
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Purchase;



"use client";
import useAuth from "@/app/hooks/useAuth";
import Navbar from "@/components/Navbar";
import { db, storage } from "@/firebase/firebase";
import {
  collection,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const Purchase = () => {
  const { user, userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && userProfile.role === "admin") {
      router.push("/admin");
    }
  }, [user, userProfile, router]);

  const [file, setFile] = useState(null);
  const [productName, setProductName] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [contact, setContact] = useState("");
  const [quantityRice, setQuantityRice] = useState("");
  const [packageCategory, setPackageCategory] = useState("");
  const [packageQuantity, setPackageQuantity] = useState("");
  const [percentage, setPercentage] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "pembelian1"),
      (snapshot) => {
        let list = [];
        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setData(list);
      },
      (error) => {
        console.log(error);
      }
    );

    return () => {
      unsub();
    };
  }, []);

  // const uploadFile = async (file) => {
  //   return new Promise((resolve, reject) => {
  //     const storageRef = ref(
  //       storage,
  //       "pembelian1/" +
  //         new Date().getTime() +
  //         file.name.replace(" ", "%20") +
  //         "KBB"
  //     );
  //     const uploadTask = uploadBytesResumable(storageRef, file);

  //     uploadTask.on(
  //       "state_changed",
  //       (snapshot) => {
  //         const progress =
  //           (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //         setPercentage(progress);
  //         switch (snapshot.state) {
  //           case "paused":
  //             console.log("Upload is paused");
  //             break;
  //           case "running":
  //             console.log("Upload is running");
  //             break;
  //         }
  //       },
  //       (error) => {
  //         reject(error);
  //       },
  //       () => {
  //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //           resolve(downloadURL);
  //         });
  //       }
  //     );
  //   });
  // };


  const uploadFile = async (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(
        storage,
        "pembelian1/" +
          new Date().getTime() +
          file.name.replace(" ", "%20") +
          "KBB"
      );
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setPercentage(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };


  const handleAddPurchase = async (e) => {
    e.preventDefault();

    try {
      const downloadURL = file ? await uploadFile(file) : null;
      const purchaseData = {
        id: new Date().getTime() + user.uid + "PEMBELIAN",
        image: downloadURL,
        productName: productName,
        deliveryAddress: deliveryAddress,
        contact: contact,
        quantityRice: quantityRice,
        packageCategory: packageCategory,
        packageQuantity: packageQuantity,
        status: "product",
        timeStamp: serverTimestamp(),
      };

      await setDoc(doc(db, "pembelian1", purchaseData.id), purchaseData);

      setFile(null);
      setProductName("");
      setDeliveryAddress("");
      setContact("");
      setQuantityRice("");
      setPackageCategory("");
      setPackageQuantity("");
      setPercentage(null);
      alert("Order request successfully added!");
    } catch (error) {
      console.log(error);
    }
  };

  // const handleUploadPayment = async (e) => {
  //   e.preventDefault();

  //   try {
  //     // Mengambil data pembelian berdasarkan productName dan deliveryAddress
  //     const querySnapshot = await getDocs(
  //       query(
  //         collection(db, "pembelian1"),
  //         where("productName", "==", productName),
  //         where("deliveryAddress", "==", deliveryAddress)
  //       )
  //     );

  //     if (querySnapshot.empty) {
  //       alert("Data transfer dan data barang tidak sesuai.");
  //       return;
  //     }

  //     querySnapshot.forEach(async (doc) => {
  //       try {
  //         // Update status menjadi "menunggu konfirmasi gudang"
  //         await updateDoc(doc.ref, { status: "menunggu konfirmasi gudang" });
  //         alert("Upload bukti pembayaran berhasil!");
  //       } catch (error) {
  //         console.error("Error updating document:", error);
  //       }
  //     });
  //   } catch (error) {
  //     console.error("Error getting documents:", error);
  //   }
  // };


  const handleUploadPayment = async (e) => {
    e.preventDefault();

    try {
      // Upload gambar ke Firebase Storage
      const downloadURL = file ? await uploadFile(file) : null;

      // Mengambil data pembelian berdasarkan productName dan deliveryAddress
      const querySnapshot = await getDocs(
        query(
          collection(db, "pembelian1"),
          where("productName", "==", productName),
          where("deliveryAddress", "==", deliveryAddress)
        )
      );

      if (querySnapshot.empty) {
        alert("Data transfer dan data barang tidak sesuai.");
        return;
      }

      querySnapshot.forEach(async (doc) => {
        try {
          // Update status menjadi "menunggu konfirmasi gudang" dan simpan URL gambar
          await updateDoc(doc.ref, { 
            status: "menunggu konfirmasi gudang",
            image: downloadURL // Simpan URL gambar ke dalam dokumen
          });
          alert("Upload bukti pembayaran berhasil!");
          setFile(null); // Reset state file setelah upload berhasil
        } catch (error) {
          console.error("Error updating document:", error);
        }
      });
    } catch (error) {
      console.error("Error getting documents:", error);
    }
  };
  return (
    <div className="w-[100%] mx-auto mt-32">
      <Navbar />
      <div className="w-[90%] flex justify-center items-center gap-3 mb-10">
        <h1 className="text-3xl font-semibold mb-3">Request Order Form</h1>
      </div>
      <div className="w-[90%] mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-4">Order Requests</h2>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Delivery Address</th>
              <th>Contact</th>
              <th>Quantity of Rice</th>
              <th>Package Category</th>
              <th>Package Quantity</th>
              <th>Status</th>
              <th>Time Stamp</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id}>
                <td>{item.productName}</td>
                <td>{item.deliveryAddress}</td>
                <td>{item.contact}</td>
                <td>{item.quantityRice}</td>
                <td>{item.packageCategory}</td>
                <td>{item.packageQuantity}</td>
                <td>{item.status}</td>
                <td>{item.timeStamp?.toDate().toString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-[90%] mx-auto mt-10">
        <h2 className="text-2xl font-semibold mb-5">Upload Payment Proof</h2>
        <div className="mb-5 text-lg">No. Rekening: 59796486447</div>
        <form onSubmit={handleUploadPayment}>
          <div className="py-4">
            <div className="flex flex-col gap-3 mb-3">
              <label htmlFor="image">Payment Proof Image</label>
              <input
                type="file"
                name="image"
                id="image"
                required
                onChange={(e) => setFile(e.target.files[0])}
              />
              {percentage !== null && percentage < 100 ? (
                <progress
                  className="progress progress-accent w-56"
                  value={percentage}
                  max="100"
                ></progress>
              ) : (
                percentage === 100 && (
                  <div className="text-green-500 font-semibold">
                    Upload Completed
                  </div>
                )
              )}
            </div>
            <div className="flex flex-col gap-3 mb-3">
              <label htmlFor="productName">Product Name</label>
              <input
                type="text"
                name="productName"
                id="productName"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>
            <div className="flex flex-col gap-3 mb-3">
              <label htmlFor="deliveryAddress">Delivery Address</label>
              <input
                type="text"
                name="deliveryAddress"
                id="deliveryAddress"
                placeholder="Enter delivery address"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>
          </div>
          <div className="w-[100%] mx-auto mt-7">
            <p>Note: Upload bukti payment ketika status berubah menjadi pembelian di acc,</p>
            <p>Pembayaran bisa dilakukan dengan cara transfer sesuai dengan harga yang tertera diatas kolom Approved Purchases</p>
          </div>
          <div className="modal-action">
            <button className="btn btn-primary" type="submit">
              Upload Payment Proof
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Purchase;
