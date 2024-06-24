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
      };

      await setDoc(doc(db, "pembelian1", purchaseData.id), {
        ...purchaseData,
        timeStamp: serverTimestamp(),
      });

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

  return (
    <div className="w-[100%] mx-auto mt-32">
      <Navbar />
      <div className="w-[90%] flex justify-center items-center gap-3 mb-10">
        <h1 className="text-3xl font-semibold mb-3">Request Order Form</h1>
      </div>
      <div className="w-[90%] mx-auto">
        <form onSubmit={handleAddPurchase}>
          <div className="py-4">
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
            <div className="flex flex-col gap-3 mb-3">
              <label htmlFor="contact">Contact</label>
              <input
                type="text"
                name="contact"
                id="contact"
                placeholder="Enter contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>
            <div className="flex flex-col gap-3 mb-3">
              <label htmlFor="quantityRice">Quantity of Rice</label>
              <input
                type="text"
                name="quantityRice"
                id="quantityRice"
                placeholder="Enter quantity of rice (e.g., 5 kg)"
                value={quantityRice}
                onChange={(e) => setQuantityRice(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>
            <div className="flex flex-col gap-3 mb-3">
              <label htmlFor="packageCategory">Package Category</label>
              <input
                type="text"
                name="packageCategory"
                id="packageCategory"
                placeholder="Enter package category"
                value={packageCategory}
                onChange={(e) => setPackageCategory(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>
            <div className="flex flex-col gap-3 mb-3">
              <label htmlFor="packageQuantity">Package Quantity</label>
              <input
                type="text"
                name="packageQuantity"
                id="packageQuantity"
                placeholder="Enter package quantity (e.g., 2 packs)"
                value={packageQuantity}
                onChange={(e) => setPackageQuantity(e.target.value)}
                required
                className="input input-bordered w-full"
              />
            </div>
            <div className="modal-action">
              <button className="btn btn-primary" type="submit">
                Request Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Purchase;
